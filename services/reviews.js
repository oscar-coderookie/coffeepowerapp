// services/reviews.js
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  runTransaction,
  serverTimestamp,
  onSnapshot,
  orderBy,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * addOrUpdateReview
 * - Si el user ya tiene review: actualiza (y recalcula promedio correctamente)
 * - Si no tiene: crea nueva review y actualiza promedio y count con transaction
 *
 * @param {string} coffeeId
 * @param {{ uid: string, displayName?: string }} user
 * @param {number} rating (1-5)
 * @param {string} comment
 */
export async function addOrUpdateReview(coffeeId, user, rating, comment = "") {
  if (!user || !user.uid) throw new Error("Usuario no autenticado");
  if (!coffeeId) throw new Error("coffeeId requerido");
  if (!rating || rating < 1 || rating > 5) throw new Error("Rating entre 1 y 5");

  const reviewsCol = collection(db, "coffees", coffeeId, "reviews");

  // 1) Buscar si ya existe una review del usuario
  const q = query(reviewsCol, where("userId", "==", user.uid));
  const snap = await getDocs(q);

  // Si existe -> actualizar
  if (!snap.empty) {
    // Asumimos que solo habrá 1 doc por userId, tomamos el primero
    const reviewDoc = snap.docs[0];
    const reviewRef = doc(db, "coffees", coffeeId, "reviews", reviewDoc.id);
    const coffeeRef = doc(db, "coffees", coffeeId);

    return runTransaction(db, async (transaction) => {
      const coffeeSnap = await transaction.get(coffeeRef);
      if (!coffeeSnap.exists()) throw new Error("Coffee no existe");

      const coffeeData = coffeeSnap.data();
      const oldAvg = coffeeData.ratingAvg || 0;
      const oldCount = coffeeData.ratingCount || 0;

      const oldRating = reviewDoc.data().rating || 0;
      const newRating = rating;

      // recalcular promedio (mismo count)
      const newAvg = oldCount > 0
        ? (oldAvg * oldCount - oldRating + newRating) / oldCount
        : newRating;

      // actualizar review y coffee atomically
      transaction.update(reviewRef, {
        rating: newRating,
        comment: comment || reviewDoc.data().comment || "",
        updatedAt: serverTimestamp(),
      });

      transaction.update(coffeeRef, {
        ratingAvg: newAvg,
      });

      return { type: "updated", reviewId: reviewDoc.id };
    });
  }

  // Si NO existe -> crear + actualizar promedio & count
  return runTransaction(db, async (transaction) => {
    const coffeeRef = doc(db, "coffees", coffeeId);
    const coffeeSnap = await transaction.get(coffeeRef);
    if (!coffeeSnap.exists()) throw new Error("Coffee no existe");

    const coffeeData = coffeeSnap.data();
    const oldAvg = coffeeData.ratingAvg || 0;
    const oldCount = coffeeData.ratingCount || 0;

    const newCount = oldCount + 1;
    const newAvg = (oldAvg * oldCount + rating) / newCount;

    // Crear la review (no podemos usar addDoc dentro transaction con auto-id fácilmente)
    // Hacemos addDoc fuera, luego transaction para actualizar coffee.
    // Para evitar condiciones de carrera, creamos la review primero y luego hacemos transaction.
    const newReviewRef = await addDoc(collection(db, "coffees", coffeeId, "reviews"), {
      userId: user.uid,
      userName: user.displayName || "",
      rating,
      comment: comment || "",
      createdAt: serverTimestamp(),
    });

    // Ahora actualizamos coffee de forma transaccional (vuelve a leer)
    const freshCoffeeSnap = await transaction.get(coffeeRef); // re-lectura dentro de transaction
    const freshData = freshCoffeeSnap.data();
    const fOldAvg = freshData.ratingAvg || 0;
    const fOldCount = freshData.ratingCount || 0;

    const finalCount = fOldCount + 1;
    const finalAvg = (fOldAvg * fOldCount + rating) / finalCount;

    transaction.update(coffeeRef, {
      ratingAvg: finalAvg,
      ratingCount: finalCount,
    });

    return { type: "created", reviewId: newReviewRef.id };
  });
}

/**
 * deleteReview
 * - Borra una review por reviewId (y recalcula promedio/count)
 *
 * @param {string} coffeeId
 * @param {string} reviewId
 */
export async function deleteReview(coffeeId, reviewId) {
  if (!coffeeId || !reviewId) throw new Error("Parámetros requeridos");

  const reviewRef = doc(db, "coffees", coffeeId, "reviews", reviewId);
  const coffeeRef = doc(db, "coffees", coffeeId);

  return runTransaction(db, async (transaction) => {
    const reviewSnap = await transaction.get(reviewRef);
    if (!reviewSnap.exists()) throw new Error("Review no existe");

    const reviewData = reviewSnap.data();
    const ratingToRemove = reviewData.rating || 0;

    const coffeeSnap = await transaction.get(coffeeRef);
    if (!coffeeSnap.exists()) throw new Error("Coffee no existe");

    const coffeeData = coffeeSnap.data();
    const oldAvg = coffeeData.ratingAvg || 0;
    const oldCount = coffeeData.ratingCount || 0;

    // Borrar review
    transaction.delete(reviewRef);

    // Recalcular promedio
    if (oldCount <= 1) {
      // quedó en cero
      transaction.update(coffeeRef, {
        ratingAvg: 0,
        ratingCount: 0,
      });
    } else {
      const newCount = oldCount - 1;
      const newAvg = (oldAvg * oldCount - ratingToRemove) / newCount;
      transaction.update(coffeeRef, {
        ratingAvg: newAvg,
        ratingCount: newCount,
      });
    }

    return { type: "deleted", reviewId };
  });
}

/**
 * fetchReviews (one-time read)
 * - Trae reviews ordenadas por createdAt desc
 *
 * @param {string} coffeeId
 * @param {number} limitOpt (opcional)
 */
export async function fetchReviews(coffeeId, limitOpt = 20) {
  const q = query(
    collection(db, "coffees", coffeeId, "reviews"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * onReviewsSnapshot (realtime)
 * - Devuelve unsubscribe
 * - callback recibe array de reviews ordenadas por createdAt desc
 *
 * @param {string} coffeeId
 * @param {function} callback
 */
export function onReviewsSnapshot(coffeeId, callback) {
  const q = query(
    collection(db, "coffees", coffeeId, "reviews"),
    orderBy("createdAt", "desc")
  );
  const unsub = onSnapshot(q, (snap) => {
    const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(arr);
  }, (err) => {
    console.error("onReviewsSnapshot error:", err);
    callback([]);
  });

  return unsub;
}
