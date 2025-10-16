import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { auth, db } from "../config/firebase";
import { sendEmailVerification, reload, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useTheme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VerifyEmailBlock = () => {
  const { colors } = useTheme();
  const [isVerified, setIsVerified] = useState(false);
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(true);

  const user = auth.currentUser;

  const ALERT_KEY = `alertShown_${user?.uid}`; // clave única por usuario

  // 🔹 Cargar estado inicial desde Firestore
  const fetchVerificationStatus = async () => {
    if (!user) return;
    setChecking(true);
    try {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsVerified(data.verified || false);

        // si ya está verificado, guardamos en AsyncStorage que no hay que mostrar alert
        if (data.verified) {
          await AsyncStorage.setItem(ALERT_KEY, "true");
        }
      }
    } catch (err) {
      console.log("Error cargando verificación:", err);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    let unsubscribe;

    const init = async () => {
      await fetchVerificationStatus();

      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser && currentUser.emailVerified && !isVerified) {
          const alertAlreadyShown = await AsyncStorage.getItem(ALERT_KEY);

          if (!alertAlreadyShown) {
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, { verified: true });
            setIsVerified(true);
            await AsyncStorage.setItem(ALERT_KEY, "true"); // guardamos que alert ya se mostró
            Alert.alert("¡Cuenta verificada!", "Tu correo ha sido confirmado.");
          } else {
            setIsVerified(true); // solo actualizamos UI, sin alert
          }
        }
      });
    };

    init();

    return () => unsubscribe && unsubscribe();
  }, []);

  const handleSendVerification = async () => {
    if (!user) return;
    setSending(true);
    try {
      await sendEmailVerification(user);
      Alert.alert(
        "Correo enviado",
        "Se ha enviado un enlace de verificación a tu correo. Revisa tu bandeja."
      );
    } catch (error) {
      console.log("Error enviando verificación:", error);
      Alert.alert("Error", "No se pudo enviar el correo de verificación.");
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={{ alignItems: "center", backgroundColor: '#d1d1d1ff', paddingVertical:6 }}>
      <Text style={{  fontFamily:'Jost_400Regular' }}>
        Estado de verificación:{" "}
        <Text style={{ fontFamily:'Jost_600SemiBold', color: isVerified ? "green" : "red" }}>
          {isVerified ? "Verificado ✅" : "No verificado ❌"}
        </Text>
      </Text>

      {!isVerified && (
        <TouchableOpacity
          onPress={handleSendVerification}
          style={{
            backgroundColor: colors.text,
            padding: 12,
            borderRadius: 8,
          }}
          disabled={sending}
        >
          <Text
            style={{
              color: colors.background,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {sending ? "Enviando..." : "Enviar enlace de verificación"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VerifyEmailBlock;
