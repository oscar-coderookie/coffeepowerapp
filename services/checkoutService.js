import Toast from "react-native-toast-message";
import { db } from "../config/firebase";
import { collection, doc, setDoc, serverTimestamp, where, orderBy, onSnapshot, query, getDocs, updateDoc, runTransaction } from "firebase/firestore";

/**
 * Retorna el siguiente índice de pedido (incrementa de forma atómica).
 * Devuelve Number (ej: 124).
 */
export async function getNextOrderIndex() {
  const counterRef = doc(db, "counters", "orders");

  const newIndex = await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(counterRef);

    if (!snap.exists()) {
      // Si no existe, lo crea con 1
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
 * Crea un pedido en Firestore y opcionalmente guarda referencia en el usuario
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
    // 🔥 Crear ID en la colección GLOBAL
    const ordersRef = collection(db, "orders");
    const orderDoc = doc(ordersRef); // genera ID automático
    const orderId = orderDoc.id;
    const orderRef = doc(db, "orders", orderId);
    //total unidades:
    const totalUnits = cartItems.reduce((acc, item) => acc + Number(item.quantity || 0), 0);
    // ✅ Genera orderIndex atómico y seguro
    const orderIndex = await getNextOrderIndex();

    // formatea el número visible al cliente
    const orderNumber = `CP-${String(orderIndex).padStart(5, "0")}`; // CP-00001
    // 🔥 Datos completos de la orden
    const orderData = {
      // Identificadores
      orderId,                 // ID global del pedido
      orderIndex,
      orderNumber,              // Número incremental (00123)
      userId: uid,

      // Datos del cliente
      userName: userData?.name || "Usuario",
      email: shippingData?.email || userData?.email || "",
      phone: shippingData?.phone || userData?.phone || "",

      // Dirección
      shippingAddress: shippingData?.address || {},
      deliveryAddressId: shippingData?.address?.id || null,

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

      // Costes
      subtotal: totals.subtotal || 0,
      discountAmount: totals.discountAmount || 0,
      shippingCost: totals.shippingCost || 0,
      total: totals.total || 0,
      currency: "EUR",

      // Envío y pago
      shippingMethod: totals.shippingMethod || "standard",
      paymentMethod: paymentData?.method || "No seleccionado",
      paymentStatus: "pendiente",

      // Estado del pedido
      status: "pendiente",
      history: [
        { status: "pendiente", timestamp: null },
      ],

      // Sistema
      appliedCoupon: shippingData?.appliedCoupon || null,
      internalNotes: "",
      deliveredAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };


    // 🌍 1. GUARDAR ORDEN COMPLETA EN /orders
    await setDoc(orderDoc, orderData);
    await updateDoc(orderRef, {
      "history.0.timestamp": serverTimestamp()
    });
    // 👤 2. GUARDAR ORDEN RESUMIDA EN /users/{uid}/orders/


    const userOrderRef = doc(db, `users/${uid}/orders/${orderId}`);

    await setDoc(userOrderRef, {
      orderId,
      orderIndex,
      orderNumber,
      status: "pendiente",
      createdAt: serverTimestamp(),
      paymentMethod: paymentData?.method || "No especificado",
      shippingMethod: shippingData?.deliveryType || "Estándar",
      discountAmount: orderData.discountAmount,
      shippingCost: orderData.shippingCost,
      // 🛒 Versión simplificada para la app
      products: orderData.items.map(item => ({
        coffeeId: item.coffeeId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal
      })),
      shippingAddress: shippingData?.address,
      subtotal: orderData.subtotal,
      total: orderData.total,
      totalUnits,
    });
    Toast.show({
      type: "success",
      text1: "Pedido Creado",
      text2: "Pedido realizado exitosamente, revisa tu historial de pedidos para mas detalles",
    });

    return {
      orderId,
      orderIndex,
      orderNumber
    };

  } catch (error) {
    console.error("❌ Error creando pedido:", error);
    throw error;
  }


};

export function listenUserOrders(userId, setOrders, setLoading) {
  try {
    const ref = collection(db, "users", userId, "orders");

    const q = query(
      ref,
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc, index) => ({
          id: doc.id,
          orderIndex: index + 1,
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
    console.error("Error inicializando listener:", error);
    setLoading(false);
    return null;
  }
}