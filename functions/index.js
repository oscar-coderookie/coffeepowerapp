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
