import React, { useContext, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, View, Text, ScrollView, StyleSheet } from "react-native";
import { doc, getDoc, setDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../../components/CustomHeader";
import { CartContext } from "../../context/CartContext";
import AvatarPicker from "../../components/AvatarPicker";
import AddressBlock from "../../components/AddressBlock";
import WhatsappBlock from "../../components/CaptureWhatsapp";
import ButtonGeneral from "../../components/ButtonGeneral";
import VerifyEmailBlock from "../../components/VerifyEmail";
import PaymentMethods from "../PaymentMethods";
import { AuthContext } from "../../context/AuthContext";
import { MotiView } from "moti"; // 👈 Importamos MotiView
import LoadingScreen from "../../components/LoadingScreen";
import { playSound } from "../../utils/soundPlayer";
import { useDrawerStatus } from "@react-navigation/drawer";
import { useUser } from "../../context/UserContext";

export default function UserAreaScreen({ navigation }) {
  const { userData, loadingUser, fetchAddresses, addresses } = useUser();
  const [avatar, setAvatar] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const { colors } = useTheme();
  const { user } = useContext(AuthContext);

  const handleAddAddress = async () => {
    if (!user) return;
    try {
      const ref = collection(db, `users/${user.uid}/addresses`);
      const docRef = await addDoc(ref, {
        CA: "",
        provincia: "",
        codigoPostal: "",
        calle: "",
        numero: "",
        piso: "",
        referencia: "",
      });
      setEditingId(docRef.id);
      fetchAddresses();
    } catch (error) {
      console.log("Error añadiendo dirección:", error);
    }
  };

  const handleDeleted = (id) => setAddresses((prev) => prev.filter((a) => a.id !== id));
  const handleUpdated = () => fetchAddresses();

  if (loadingUser) {
  return <LoadingScreen />;
}

  return (
    <View style={styles.container}>
      <VerifyEmailBlock />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView>

          {/* 🌀 Animación de entrada para avatar y nombre */}
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600 }}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "space-around",
              flexDirection: "row",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <AvatarPicker size={100} initialAvatar={avatar} onAvatarChange={setAvatar} />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontFamily: "Jost_600SemiBold", textTransform: "uppercase", width: "100%", color: colors.text }}>
                Bienvenido:
              </Text>
              <Text style={{ textTransform: "capitalize", fontFamily: "Jost_400Regular", color: colors.text }}>
                {userData?.name ?? "Usuario"}
              </Text>
            </View>
          </MotiView>

          {/* 🧱 Secciones animadas al hacer scroll */}

          <Text style={[styles.title, { backgroundColor: colors.text, color: colors.background }]}>
            Datos de contacto:
          </Text>
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 800, delay: 200 }}
            style={styles.infoContainer}
          >
            <View style={{ alignItems: "center", marginVertical: 10 }}>
              <Text style={{ fontFamily: "Jost_600SemiBold", textTransform: "uppercase", color: colors.text }}>
                Correo registrado:
              </Text>
              <Text style={{ fontFamily: "Jost_400Regular", color: colors.text }}>
               {userData?.email ?? "No definido"}
              </Text>
            </View>
          </MotiView>
          <Text style={[styles.text, { color: colors.text }]}>
            Aquí puedes gestionar tus datos de envío para tus pedidos:
          </Text>

          <View style={styles.field}>
            {addresses.map((item) => (
              <MotiView
                key={item.id}
                from={{ opacity: 0, translateY: 15 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 1200, delay: 400 }}
              >
                <AddressBlock
                  addressId={item.id}
                  initialData={item}
                  onDeleted={handleDeleted}
                  onUpdated={handleUpdated}
                />
              </MotiView>
            ))}

            <ButtonGeneral
              bckColor={["#000000ff", "#535353ff", "#000000ff", "#6b6b6bff", "#000000ff"]}
              text="+ Añadir dirección"
              textColor="white"
              onTouch={handleAddAddress}
              borderColors={["#535353ff", "#000000ff", "#535353ff", "#000000ff", "#535353ff"]}
              soundType="click"
            />

            <WhatsappBlock />
          </View>

          <Text style={[styles.title, { backgroundColor: colors.text, color: colors.background }]}>
            Métodos de pago:
          </Text>

          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 1200, delay: 500 }}
            style={styles.paymentMethods}
          >
            <PaymentMethods />
          </MotiView>

        </ScrollView>

        <ButtonGeneral
          bckColor={["#000000ff", "#535353ff", "#000000ff", "#6b6b6bff", "#000000ff"]}
          text="Ir a tu carrito"
          textColor="white"
          onTouch={() => {
            playSound("click"); // 🎵 reproduce el sonido
            const rootNavigation = navigation.getParent()?.getParent();
            rootNavigation?.navigate("CartScreen");
          }}
          marginHorizontal={10}
          borderColors={["#535353ff", "#000000ff", "#535353ff", "#000000ff", "#535353ff"]}
          soundType="click"

        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-start", paddingBottom: 20 },
  title: {
    fontSize: 18,
    textTransform: "uppercase",
    textAlign: "center",
    fontFamily: "Jost_700Bold",
    padding: 10,
  },
  text: {
    textAlign: "center",
    fontFamily: "Jost_400Regular",
  },
  infoContainer: { width: "100%" },
  field: {
    width: "100%",
    justifyContent: "center",
    padding: 10,
  },
  paymentMethods: {
    justifyContent: "center",
  },
});
