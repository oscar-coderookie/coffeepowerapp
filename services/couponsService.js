import { collection, query, onSnapshot } from "firebase/firestore";
import { db, functions } from "../config/firebase";
import { httpsCallable } from "firebase/functions";

export const listenUserCoupons = (uid, callback) => {
  const ref = collection(db, "users", uid, "coupons");
  const q = query(ref);

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const coupons = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    callback(coupons);
  });

  return unsubscribe;
};

export const markCouponUsed = async (uid, couponId, orderId, paymentStatus) => {
  try {
    const fn = httpsCallable(functions, "markCouponAsUsed");
    const res = await fn({ uid, couponId, orderId, paymentStatus });

    return res.data;
  } catch (err) {
    console.log("❌ Error al marcar cupón:", err);
    throw err;
  }
};