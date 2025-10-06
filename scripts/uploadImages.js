// scripts/uploadCoffees.js
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");
const mime = require("mime-types");

// 🔹 Inicializa Firebase Admin
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "aroma-king-web.appspot.com",
});

const bucket = admin.storage().bucket();

// 🔹 Carpeta local de imágenes
const coffeeFolder = path.join(__dirname, "../assets/coffees");

// 🔹 Función para subir imágenes
async function uploadCoffees() {
  const files = fs.readdirSync(coffeeFolder);
  const coffeeLinks = {};

  console.log("🚀 Subiendo imágenes de café...");

  for (const fileName of files) {
    const filePath = path.join(coffeeFolder, fileName);
    const destination = `coffees/${fileName}`;
    const contentType = mime.lookup(filePath) || "application/octet-stream";

    try {
      // 🔸 Sube archivo a Firebase Storage
      await bucket.upload(filePath, {
        destination,
        metadata: {
          contentType,
          cacheControl: "public, max-age=31536000",
        },
      });

      // 🔸 Genera link público
      const file = bucket.file(destination);
      const [metadata] = await file.getMetadata();

      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${metadata.bucket}/o/${encodeURIComponent(metadata.name)}?alt=media`;

      coffeeLinks[fileName] = publicUrl;

      console.log(`✅ ${fileName} subido correctamente`);
    } catch (error) {
      console.error(`❌ Error subiendo ${fileName}:`, error.message);
    }
  }

  // 🔹 Guarda los links en un JSON
  const outputPath = path.join(__dirname, "coffeeLinks.json");
  fs.writeFileSync(outputPath, JSON.stringify(coffeeLinks, null, 2));

  console.log("\n🎉 ¡Todas las imágenes subidas!");
  console.log(`🗂️ Links guardados en: ${outputPath}`);
}

// 🔹 Ejecuta el script
uploadCoffees();
