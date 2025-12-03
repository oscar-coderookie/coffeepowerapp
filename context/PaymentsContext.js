import { createContext, useContext, useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { initPaymentSheet, presentPaymentSheet } from "@stripe/stripe-react-native";
import { auth } from "../config/firebase";

const PaymentContext = createContext();

export const usePayments = () => useContext(PaymentContext)

export const PaymentProvider = ({ children }) => {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    const handleAddPaymentMethod = async () => {
        const user = auth.currentUser;
        if (!user) return Toast.show({
            type: "error",
            text1: "Error",
            text2: "Debes iniciar sesión",
        });

        try {
            // 1️⃣ Crear SetupIntent
            const res = await fetch(
                "https://us-central1-chris-rosas-web.cloudfunctions.net/api/createSetupIntent",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ uid: user.uid, email: user.email }),
                }
            );
            const { client_secret } = await res.json();
            if (!client_secret)
                return Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "No se pudo generar SetupIntent",
                });

            // 2️⃣ Inicializar PaymentSheet
            const { error: initError } = await initPaymentSheet({
                setupIntentClientSecret: client_secret,
                merchantDisplayName: "Coffee Power",
                googlePay: true,
                applePay: true,
            });

            if (initError) {
                console.log("Init PaymentSheet error:", initError);
                return Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: initError.message,
                });
            }

            // 3️⃣ Mostrar PaymentSheet
            const { error: presentError } = await presentPaymentSheet();
            if (presentError) {
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: presentError.message,
                });
            } else {
                Toast.show({
                    type: "success",
                    text1: "✅ Método de pago agregado",
                    text2: "Tu método de pago se vinculó correctamente",
                });
                fetchPaymentMethods(); // 🔁 Actualizar lista tras añadir
            }
        } catch (err) {
            console.log(err);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudo vincular el método de pago",
            })
        }
    };

    const handleRemoveMethod = async (paymentMethodId) => {
        try {
            const res = await fetch(
                "https://us-central1-chris-rosas-web.cloudfunctions.net/api/detachPaymentMethod",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ paymentMethodId }),
                }
            );
            const data = await res.json();
            if (data.id) {
                Toast.show({
                    type: "error",
                    text1: "Método eliminado",
                    text2: "Se ha eliminado correctamente",
                })
                fetchPaymentMethods();
            } else {
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "No se pudo eliminar el método de pago",
                })
            }
        } catch (err) {
            console.log(err);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudo eliminar el método de pago",
            })
        }
    };

    const fetchPaymentMethods = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            setLoading(true);
            const res = await fetch(
                "https://us-central1-chris-rosas-web.cloudfunctions.net/api/listPaymentMethods",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ uid: user.uid, email: user.email }),
                }
            );
            const data = await res.json();
            if (Array.isArray(data)) {
                setPaymentMethods(data);
            } else {
                console.log("Respuesta inesperada:", data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <PaymentContext.Provider
            value={{
                handleAddPaymentMethod,
                handleRemoveMethod,
                paymentMethods
            }}>
            {children}
        </PaymentContext.Provider>
    )
}