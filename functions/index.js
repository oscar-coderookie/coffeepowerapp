const express = require("express");
const cors = require("cors");
const { onRequest, } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2/options");
const { defineSecret } = require("firebase-functions/params");
const { auth } = require("firebase-functions/v1"); // <-- CAMBIO CLAVE AQUÍ// <-- Importa el módulo completo de v2

setGlobalOptions({ region: "us-central1" });

// Definimos el secreto
const STRIPE_SECRET = defineSecret("STRIPE_SECRET");
// -------------------------------
// ✅ APP EXPRESS
// -------------------------------
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());


const functions = require("firebase-functions");
const admin = require("firebase-admin");


admin.initializeApp();
const db = admin.firestore();

//funcion para marcar cupon como usado desde el backend (metodo seguro):

exports.markCouponAsUsedHttp = functions.https.onRequest(async (req, res) => {
  try {
    const { uid, couponId, orderId, paymentStatus } = req.body;
    
    if (!uid || !couponId || !paymentStatus) {
      return res.status(400).json({ error: "Faltan parámetros: uid, couponId, paymentStatus" });
    }

    if (paymentStatus !== "succeeded") {
      return res.status(400).json({ error: "El pago no está confirmado" });
    }

    const couponRef = admin.firestore().doc(`users/${uid}/coupons/${couponId}`);
    await admin.firestore().runTransaction(async (tx) => {
      const snap = await tx.get(couponRef);
      if (!snap.exists) throw new Error("Cupón no existe");
      const data = snap.data();
      if (data.used) throw new Error("Cupón ya ha sido utilizado");

      tx.update(couponRef, {
        used: true,
        usedAt: admin.firestore.FieldValue.serverTimestamp(),
        usedOrderId: orderId || null,
      });
    });

    return res.json({ ok: true, message: "Cupón marcado como usado" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
});
//funcion para mensajes masivos replicados:
exports.replicateMassMessage = functions.https.onRequest(async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).send("No se recibió mensaje");

    const usersSnapshot = await db.collection("users").get();

    const batch = db.batch();

    usersSnapshot.forEach((doc) => {
      const userMessagesRef = db
        .collection("users")
        .doc(doc.id)
        .collection("messages")
        .doc(); // genera ID automáticamente

      batch.set(userMessagesRef, {
        ...message,
        createdAt: new Date(),
        read: false,
      });
    });

    await batch.commit();

    res.status(200).send("Mensaje replicado a todos los usuarios");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});
//borrar datos de usuario eliminado de auth:
exports.deleteAccount = auth.user().onDelete(async (user) => {
  const uid = user.uid; // En v1, el UID está directamente en user.uid

  // Referencia a la colección de usuarios en Firestore
  const userDocRef = admin.firestore().collection('users').doc(uid);

  try {
    await admin.firestore().recursiveDelete(userDocRef);
    console.log(`Documento del usuario ${uid} eliminado exitosamente de Firestore.`);
    return null;
  } catch (error) {
    console.error(`Error al eliminar el documento del usuario ${uid}:`, error);
    return null;
  }
})
//funcion de correo y mensaje de bienvenida:
exports.welcomeMessages = auth.user().onCreate(async (user) => {
  const userId = user.uid;
  try {

    await new Promise(res => setTimeout(res, 300));

    // 🔍 Leer el nombre desde Firestore (siempre llega correcto)
    const userDoc = await admin.firestore().collection("users").doc(userId).get();
    const userName = userDoc.exists ? userDoc.data().name : "Usuario";

    const welcomeMessage = {
      title: "Bienvenido a Coffee Power App",
      body: `Hola ${userName}! Te damos una calurosa bienvenida a la familia de Coffee Power. ¿Estás listo para probar el mejor café del mundo?`,
      type: "inform",
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await admin.firestore()
      .collection("users")
      .doc(userId)
      .collection("messages")
      .add(welcomeMessage);

    console.log(`Mensaje de bienvenida agregado para el usuario ${userId}`);
  } catch (error) {
    console.error("Error al agregar el mensaje de bienvenida:", error);
  }
});
// 🔹 Helper: crear o recuperar cliente de Stripe
// -------------------------------
async function getOrCreateCustomer(stripe, uid, email) {
  // 1️⃣ Buscar por UID en metadata (LA MANERA CORRECTA)
  const existingByUID = await stripe.customers.list({
    limit: 1,
    expand: [],
    email: undefined, // nos aseguramos de no filtrar por email
  });

  // Filtramos manualmente porque Stripe no permite buscar por metadata directamente
  const customerByUID = existingByUID.data.find(
    (c) => c.metadata?.firebaseUID === uid
  );

  if (customerByUID) {
    return customerByUID.id;
  }

  // 2️⃣ Si no existe, buscar por email como fallback
  if (email) {
    const existingByEmail = await stripe.customers.list({ email, limit: 1 });
    if (existingByEmail.data.length > 0) {
      // Actualizamos metadata para vincularlo bien
      await stripe.customers.update(existingByEmail.data[0].id, {
        metadata: { firebaseUID: uid },
      });
      return existingByEmail.data[0].id;
    }
  }

  // 3️⃣ Crear nuevo Customer
  const customer = await stripe.customers.create({
    email: email || undefined,
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
// Compra de prueba:
app.post("/createTestPayment", async (req, res) => {
  try {
    const stripe = require("stripe")(STRIPE_SECRET.value());
    const { amount, currency = "eur" } = req.body;

    // 1️⃣ Crear PaymentIntent y confirmar inmediatamente
    const paymentIntent = await stripe.paymentIntents.create({
      amount,             // en centavos, ej: 10€ → 1000
      currency,
      payment_method: "pm_card_visa",
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never", // evita errores de redirección
      },
    });

    // 2️⃣ Responder con la info del PaymentIntent
    return res.status(200).json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      payment_method: paymentIntent.payment_method,
      created: paymentIntent.created,
    });
  } catch (error) {
    console.error("Error en createTestPayment:", error);
    return res.status(500).json({ error: error.message });
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
