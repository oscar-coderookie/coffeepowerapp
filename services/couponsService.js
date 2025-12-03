import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

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
