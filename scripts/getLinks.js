// getLinks.js
const path = require("path");
const fs = require("fs");
const admin = require("firebase-admin");

// 🔹 Usar require en vez de import para JSON
const serviceAccount = require("../serviceAccountKey.json");

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "coffee-power-app.appspot.com", // <- tu bucket
});

const bucket = admin.storage().bucket();

// Carpetas locales
const folders = {
  coffees: path.join("../assets/coffees"),
  backgrounds: path.join("../assets/backgrounds"),
};

// Función para generar URL firmada
async function getURL(remotePath) {
  const file = bucket.file(remotePath);
  const url = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 año
  });
  return url[0];
}

// Función para procesar carpeta completa
async function processFolder(folderName, folderPath) {
  const result = {};
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const remoteFilePath = `${folderName}/${file}`;
    console.log(`🔗 Generando link para ${file}...`);
    const url = await getURL(remoteFilePath);
    console.log(`✅ ${file} -> ${url}`);
    result[file] = url;
  }
  return result;
}

// Ejecutar todo
(async () => {
  const allLinks = {};
  for (const [folderName, folderPath] of Object.entries(folders)) {
    console.log(`\n💡 Procesando carpeta: ${folderName}`);
    allLinks[folderName] = await processFolder(folderName, folderPath);
  }
  console.log("\n🎉 Todos los links generados:");
  console.log(JSON.stringify(allLinks, null, 2));
})();
