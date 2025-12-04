import { createContext, useContext, useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { initPaymentSheet, presentPaymentSheet } from "@stripe/stripe-react-native";
import { auth } from "../config/firebase";

const PaymentContext = createContext();

export const usePayments = () => useContext(PaymentContext)

export const PaymentProvider = ({ children }) => {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(false);
    
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

    useEffect(() => {
        const user = auth.currentUser;
        if (user) fetchPaymentMethods(); // cargar al montar si ya hay usuario
        const unsub = auth.onAuthStateChanged((user) => {
            if (user) fetchPaymentMethods();
        });
        return unsub;
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



    const handleTestPayment = async (amount) => {
        const user = auth.currentUser;
        if (!user) {
            return Toast.show({
                type: "error",
                text1: "Error",
                text2: "Debes iniciar sesión",
            });
        }

        try {
            // 1️⃣ Crear PaymentIntent en modo test
            const res = await fetch(
                "https://us-central1-chris-rosas-web.cloudfunctions.net/api/createPaymentIntentTest",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        uid: user.uid,
                        email: user.email,
                        // EL paymentMethod que YA tienes guardado:
                        paymentMethodId: paymentMethods[0]?.id,
                        amount,
                    }),
                }
            );

            const data = await res.json();
            const clientSecret = data.client_secret;

            if (!clientSecret) {
                return Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "No se pudo generar el PaymentIntent",
                });
            }

            // 2️⃣ Inicializar PaymentSheet para confirmar el pago
            const init = await initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName: "Coffee Power",
            });

            if (init.error) {
                console.log(init.error);
                return Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: init.error.message,
                });
            }

            // 3️⃣ Presentar y pagar con la tarjeta de prueba ya guardada en Stripe
            const result = await presentPaymentSheet();

            if (result.error) {
                return Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: result.error.message,
                });
            }

            // 4️⃣ Pago confirmado ✔
            Toast.show({
                type: "success",
                text1: "Pago exitoso",
                text2: "El pago se procesó correctamente",
            });

            // 5️⃣ Retornar IDs para guardar en la orden
            return {
                paymentIntentId: data.paymentIntentId,
                paymentMethodId: data.paymentMethodId,
                amount,
                brand: data.card?.brand,
                last4: data.card?.last4,
                expMonth: data.card?.exp_month,
                expYear: data.card?.exp_year,
            };

        } catch (err) {
            console.log(err);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudo procesar el pago",
            });
        }
    };

    return (
        <PaymentContext.Provider
            value={{
                handleAddPaymentMethod,
                handleRemoveMethod,
                handleTestPayment,
                paymentMethods,
                loading
            }}>
            {children}
        </PaymentContext.Provider>
    )
}