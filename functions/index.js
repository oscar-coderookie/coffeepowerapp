const express = require("express");
const cors = require("cors");
const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2/options");
const { defineSecret } = require("firebase-functions/params");

setGlobalOptions({ region: "us-central1" });

// Definimos el secreto
const STRIPE_SECRET = defineSecret("STRIPE_SECRET");

// -------------------------------
// ✅ APP EXPRESS
// -------------------------------
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// -------------------------------
// 🔹 Helper: crear o recuperar cliente de Stripe
// -------------------------------
async function getOrCreateCustomer(stripe, uid, email) {
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data.length > 0) return existing.data[0].id;

  const customer = await stripe.customers.create({
    email,
    metadata: { firebaseUID: uid },
  });

  return customer.id;
}

// -------------------------------
// 🔹 Crear SetupIntent
// -------------------------------
app.post("/createSetupIntent", async (req, res) => {
  try {
    const { uid, email } = req.body;
    if (!uid) return res.status(400).json({ error: "uid es requerido" });

    const stripe = require("stripe")(STRIPE_SECRET.value());
    const customerId = await getOrCreateCustomer(stripe, uid, email || "");

    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
    });

    res.json({ client_secret: setupIntent.client_secret });
  } catch (error) {
    console.error("❌ Error createSetupIntent:", error);
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------
// 🔹 Listar métodos de pago
// -------------------------------
app.post("/listPaymentMethods", async (req, res) => {
  try {
    const { uid, email } = req.body;
    if (!uid) return res.status(400).json({ error: "uid es requerido" });

    const stripe = require("stripe")(STRIPE_SECRET.value());
    const customerId = await getOrCreateCustomer(stripe, uid, email || "");

    const methods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });

    res.json(methods.data);
  } catch (error) {
    console.error("❌ Error listPaymentMethods:", error);
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------
// 🔹 Eliminar método de pago
// -------------------------------
app.post("/detachPaymentMethod", async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    if (!paymentMethodId)
      return res.status(400).json({ error: "paymentMethodId es requerido" });

    const stripe = require("stripe")(STRIPE_SECRET.value());
    const detached = await stripe.paymentMethods.detach(paymentMethodId);

    res.json(detached);
  } catch (error) {
    console.error("❌ Error detachPaymentMethod:", error);
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------
// ✅ EXPORTAR LA FUNCIÓN HTTPS CON EL SECRETO
// -------------------------------
exports.api = onRequest({ secrets: [STRIPE_SECRET] }, app);
