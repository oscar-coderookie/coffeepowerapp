import Toast from "react-native-toast-message";
import { db } from "../config/firebase";
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  where,
  orderBy,
  onSnapshot,
  query,
  getDocs,
  updateDoc,
  runTransaction
} from "firebase/firestore";

/**
 * Retorna el siguiente índice de pedido (incrementa de forma atómica)
 */
export async function getNextOrderIndex() {
  const counterRef = doc(db, "counters", "orders");

  const newIndex = await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(counterRef);

    if (!snap.exists()) {
      transaction.set(counterRef, { lastOrderIndex: 1 });
      return 1;
    }

    const last = snap.data().lastOrderIndex || 0;
    const next = last + 1;
    transaction.update(counterRef, { lastOrderIndex: next });
    return next;
  });

  return newIndex;
}

/**
 * Crea una orden SOLO en /orders (sin duplicación en /users/{uid}/orders)
 */
export const createOrder = async (
  uid,
  userData,
  shippingData,
  paymentData,
  cartItems,
  totals
) => {
  try {
    // 🔥 Crear ID en la colección global
    const orderRef = doc(collection(db, "orders"));
    const orderId = orderRef.id;

    // Total unidades
    const totalUnits = cartItems.reduce(
      (acc, item) => acc + Number(item.quantity || 0),
      0
    );

    // Índice incremental atómico
    const orderIndex = await getNextOrderIndex();
    const orderNumber = `CP-${String(orderIndex).padStart(4, "0")}`;

    // 🔥 Datos completos del pedido
    const orderData = {
      orderId,
      orderIndex,
      orderNumber,
      userId: uid,

      // Cliente
      userName: userData?.name || "Usuario",
      email: shippingData?.email || userData?.email || "",
      phone: shippingData?.phone || userData?.phone || "",

      // Dirección
      shippingAddress: shippingData?.address || {},

      fullAddressFormatted: `
${shippingData.address.calle} ${shippingData.address.numero}, 
Piso ${shippingData.address.piso}, Puerta ${shippingData.address.puerta}
${shippingData.address.provincia}, ${shippingData.address.CA}
${shippingData.address.codigoPostal}
Referencia: ${shippingData.address.referencia || "N/A"}
`.trim(),

      // Productos
      items: cartItems.map(item => ({
        coffeeId: item.id,
        name: item.name,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 0,
        subtotal: (Number(item.price) || 0) * (Number(item.quantity) || 0)
      })),
      totalUnits,

      // Totales
      subtotal: totals.subtotal || 0,
      discountAmount: totals.discountAmount || 0,
      shippingCost: totals.shippingCost || 0,
      total: totals.total || 0,
      currency: "EUR",

      shippingMethod: totals.shippingMethod || "standard",

      // Tracking
      carrier: null,
      trackingNumber: null,
      shipmentStatus: "pending",
      shippedAt: null,
      deliveredAt: null,

      // Pago
      paymentMethod: paymentData?.method || "No seleccionado",
      paymentStatus: "pendiente",
      paymentInfo: paymentData || null,

      // Otros
      appliedCoupon: shippingData?.appliedCoupon || null,
      internalNotes: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // 📌 Guardar en /orders
    await setDoc(orderRef, orderData);

    Toast.show({
      type: "success",
      text1: "Pedido Creado",
      text2: "Tu pedido se registró correctamente"
    });

    return { orderId, orderIndex, orderNumber };

  } catch (error) {
    console.error("❌ Error creando pedido:", error);
    throw error;
  }
};

/**
 * 🔥 Escuchar pedidos del usuario desde /orders
 * - NO usamos subcolección
 * - Filtramos por userId
 * - Ordenamos por fecha
 */
export function listenUserOrders(userId, setOrders, setLoading) {
  try {
    const ref = collection(db, "orders");

    const q = query(
      ref,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error escuchando órdenes:", err);
        setLoading(false);
      }
    );

    return unsubscribe;

  } catch (error) {
    console.error("Error en listenUserOrders:", error);
    setLoading(false);
  }
}
