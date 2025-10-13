const functions = require("firebase-functions");
const stripe = require("stripe")(functions.config().stripe.secret);
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.post("/createSetupIntent", async (req, res) => {
  try {
    const customerId = req.body.customerId; // opcional
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card", "google_pay", "apple_pay"],
    });
    res.json({ client_secret: setupIntent.client_secret });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

exports.api = functions.https.onRequest(app);
