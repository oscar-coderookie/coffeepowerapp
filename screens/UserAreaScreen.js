import React, { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { KeyboardAvoidingView, Platform } from "react-native";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../components/CustomHeader";
import { CartContext } from "../context/CartContext";
import LoadingScreen from "../components/LoadingScreen";
import AvatarPicker from "../components/AvatarPicker";
import AddressBlock from "../components/AddressBlock";
import WhatsappBlock from "../components/CaptureWhatsapp";
import ButtonGeneral from "../components/ButtonGeneral";
import VerifyEmailBlock from "../components/VerifyEmail";
import PaymentMethods from "./PaymentMethods";
import { AuthContext } from "../context/AuthContext";


export default function UserAreaScreen({ navigation }) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState(""); // correo de Firestore
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const { colors } = useTheme();
  const { isLoading } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        setCheckingAuth(false);
        setTimeout(() => navigation.replace("Login"), 300);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        let userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            phone: "",
            name: user.displayName || "Usuario",
            email: user.email || "",
            coupons: [],
            createdAt: new Date(),
          });
          userSnap = await getDoc(userRef);
        }

        const data = userSnap.data();
        setUserName(data.name || "Usuario");
        setUserEmail(user.email || "No definido");
        await fetchAddresses(user.uid);
      } catch (err) {
        console.error("❌ Error cargando datos del usuario:", err);
      } finally {
        setCheckingAuth(false);
      }
    };

    loadUserData();
  }, [user]);


  // 🔹 Obtener direcciones del usuario
  const fetchAddresses = async (uid = user?.uid) => {
    if (!uid) return;
    try {
      const snapshot = await getDocs(collection(db, `users/${uid}/addresses`));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAddresses(list);
    } catch (error) {
      console.log("Error cargando direcciones:", error);
    }
  };

  // 🔹 Añadir nueva dirección vacía
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


  // 🔹 Callbacks para AddressBlock
  const handleDeleted = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleUpdated = () => fetchAddresses();



  return (
    <View style={styles.container}>
      <CustomHeader title='Perfil Personal' showBack={false} />
      <VerifyEmailBlock />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "space-around",
              flexDirection: 'row',
              paddingTop: 10,
              paddingBottom: 10
            }}
          >
            <AvatarPicker
              size={100}
              initialAvatar={avatar}
              onAvatarChange={setAvatar}
            />
            <View style={{
              alignItems: 'center'
            }}>
              <Text style={{ fontFamily: 'Jost_600SemiBold', textTransform: 'uppercase', width: '100%', color: colors.text }}>Bienvenido:</Text>
              <Text style={{ textTransform: 'capitalize', fontFamily: 'Jost_400Regular', color: colors.text }}>{userName}</Text>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text
              style={[styles.title, { backgroundColor: colors.text, color: colors.background }]}
            >
              Datos de contacto:
            </Text>

            <View style={{ alignItems: 'center', marginVertical: 10 }}>
              <Text style={{ fontFamily: 'Jost_600SemiBold', textTransform: 'uppercase', color: colors.text }}>
                Correo registrado:
              </Text>
              <Text style={{ fontFamily: 'Jost_400Regular', color: colors.text }}>
                {userEmail || "No definido"}
              </Text>
            </View>

            <Text style={[styles.text, { color: colors.text }]}>
              Aquí puedes gestionar tus datos de envío para tus pedidos:
            </Text>

            <View style={styles.field}>
              {addresses.map((item) => (
                <AddressBlock
                  key={item.id}
                  addressId={item.id}
                  initialData={item}
                  onDeleted={handleDeleted}
                  onUpdated={handleUpdated}
                  isEditingAddress={editingId === item.id}
                  setIsEditingAddress={(value) => {
                    if (!value) setEditingId(null);
                    else setEditingId(item.id);
                  }}
                />
              ))}

              <ButtonGeneral
                bckColor={colors.text}
                Color
                text="+ Añadir dirección"
                textColor={colors.background}
                onTouch={handleAddAddress}
              />

              <WhatsappBlock />
            </View>
            <Text
              style={[styles.title, { backgroundColor: colors.text, color: colors.background }]}
            >
              Métodos de pago:
            </Text>
            <View style={styles.paymentMethods}>
              <PaymentMethods />
            </View>
          </View>
        </ScrollView>

        <ButtonGeneral
          bckColor={colors.text}
          Color
          text="Ir a tu carrito"
          textColor={colors.background}
          onTouch={() =>
            navigation.navigate("Nuestros Cafés", { screen: "Carrito" })
          }
          marginHorizontal={10}
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
  button: { padding: 15, borderRadius: 8, margin: 8 },
  infoContainer: { width: "100%" },
  field: {
    width: "100%",
    justifyContent: "center",
    padding: 10,
  },
  buttonText: {
    fontFamily: "Jost_700Bold",
    textTransform: "uppercase",
    textAlign: "center",
  },
  paymentMethods: {
    justifyContent: 'center',

  },
  addPay: {
    padding: 16,
    borderRadius: 10,
    margin: 10
  }
});
