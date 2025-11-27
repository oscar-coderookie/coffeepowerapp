import { db } from "../config/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

/**
 * Crea un pedido en Firestore y opcionalmente guarda referencia en el usuario
 * @param {string} uid - ID del usuario
 * @param {Object} userData - {name, email, phone}
 * @param {Object} shippingData - {address, phone, email, appliedCoupon}
 * @param {Object} paymentData - {method}
 * @param {Array} cartItems - array de productos [{id, name, price, quantity}]
 * @param {Object} totals - {subtotal, discountAmount, shippingCost, total}
 * @returns {Promise<string>} orderId generado
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
    const ordersRef = collection(db, "orders");
    const orderDoc = doc(ordersRef); // genera un ID automático
    const orderId = orderDoc.id;

    const orderData = {
      userId: uid,
      userName: userData?.name || "Usuario",
      email: shippingData?.email || userData?.email || "",
      phone: shippingData?.phone || userData?.phone || {},
      shippingAddress: shippingData?.address || {},
      paymentMethod: paymentData?.method || "No seleccionado",
      items: cartItems.map(item => ({
        coffeeId: item.id,
        name: item.name,
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 0,
        subtotal: (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)
      })),
      subtotal: totals.subtotal || 0,
      discountAmount: totals.discountAmount || 0,
      shippingCost: totals.shippingCost || 0,
      total: totals.total || 0,
      appliedCoupon: shippingData?.appliedCoupon || null,
      status: "pendiente",
      createdAt: serverTimestamp()
    };

    await setDoc(orderDoc, orderData);

    // 🔹 Opcional: referencia en subcolección del usuario
    const userOrderRef = doc(db, `users/${uid}/orders/${orderId}`);
    await setDoc(userOrderRef, {
      orderRef: orderDoc.path,
      status: "pendiente",
      createdAt: serverTimestamp(),
      paymentMethod: paymentData?.method || "No especificado",
      shippingMethod: shippingData?.deliveryType || "Estándar",
      // 🛒 Lista de productos simplificada
      products: orderData.items.map(item => ({
        coffeeId: item.coffeeId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal
      }))
    });

    return orderId;
  } catch (error) {
    console.error("❌ Error creando pedido:", error);
    throw error;
  }
};
