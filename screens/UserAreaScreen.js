import React, { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { KeyboardAvoidingView, Platform } from "react-native";
import {
  doc,
  updateDoc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../components/CustomHeader";
import { CartContext } from "../context/CartContext";
import LoadingScreen from "../components/LoadingScreen";
import AvatarPicker from "../components/AvatarPicker";
import AddressBlock from "../components/AddressBlock";
import WhatsappBlock from "../components/CaptureWhatsapp";

export default function UserAreaScreen({ navigation }) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [phone, setPhone] = useState({ codigo: "34", numero: "" });
  const [countryCode, setCountryCode] = useState("ES");
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const { colors } = useTheme();
  const { isLoading } = useContext(CartContext);
  const user = auth.currentUser;

  const getCountryCodeFromCallingCode = (callingCode) => {
    switch (callingCode) {
      case "34":
        return "ES";
      default:
        return "ES";
    }
  };

  // 🔹 1️⃣ Verificar sesión y cargar datos de usuario desde Firestore
  useEffect(() => {
    console.log("🔄 Iniciando verificación de sesión...");

    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        try {
          const userRef = doc(db, "users", userAuth.uid);
          const userSnap = await getDoc(userRef);

          // 🔹 Si el usuario no existe en Firestore, creamos el documento con name y phone
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              phone: "",
              name: userAuth.displayName || "Usuario",
            });
          }

          const data = userSnap.exists() ? userSnap.data() : { phone: "", name: "Usuario" };

          // 🔹 Configuramos el nombre desde Firestore
          setUserName(data.name || "Usuario");

          // 🔹 Configuramos el email
          setUserEmail(userAuth.email || "");

          // 🔹 Configuramos el teléfono
          if (data.phone && typeof data.phone === "object") {
            setPhone({
              codigo: data.phone.codigo || "34",
              numero: data.phone.numero || "",
            });
            setCountryCode(getCountryCodeFromCallingCode(data.phone.codigo));
          } else {
            setPhone({ codigo: "34", numero: "" });
          }

          // 🔹 Cargamos direcciones
          await fetchAddresses(userAuth.uid);

        } catch (err) {
          console.log("❌ Error cargando datos del usuario:", err);
        } finally {
          setCheckingAuth(false);
        }
      } else {
        console.log("🚫 No hay usuario, redirigiendo a Login...");
        setTimeout(() => {
          navigation.replace("Login");
        }, 1500);
      }
    });

    return unsubscribe;
  }, []);

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

  // 🔹 Guardar teléfono
  const savePhone = async () => {
    if (!phone.numero) {
      Alert.alert("Número vacío", "Por favor, ingresa tu número.");
      return;
    }

    const formatted = `+${phone.codigo}${phone.numero.replace(/\D/g, "")}`;
    try {
      if (!user) return Alert.alert("Error", "Debes iniciar sesión.");

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { phone: formatted }, { merge: true });

      setIsEditingPhone(false);
      Alert.alert("Guardado", "Número de WhatsApp actualizado ✅");
    } catch (error) {
      console.log("❌ Error guardando número:", error);
      Alert.alert("Error", "No se pudo guardar el número. Intenta de nuevo.");
    }
  };

  // 🔹 Guardar nombre del usuario (opcional)
  const saveUserName = async (newName) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { name: newName }, { merge: true });
    setUserName(newName);
  };

  if (checkingAuth || isLoading) {
    return <LoadingScreen message="Verificando sesión..." />;
  }

  return (
    <View style={styles.container}>
      <CustomHeader
        title={`Perfil: ${userName?.toUpperCase() || "Usuario"}`}
        showBack={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 10,
            }}
          >
            <AvatarPicker
              size={100}
              initialAvatar={avatar}
              onAvatarChange={setAvatar}
            />
          </View>

          <Text style={[styles.text, { color: colors.text }]}>
            Bienvenido a tu espacio personal de Coffee Power APP
          </Text>

          <View style={styles.infoContainer}>
            <Text
              style={[
                styles.title,
                { backgroundColor: colors.text, color: colors.background },
              ]}
            >
              Datos personales:
            </Text>

            <Text style={[styles.text, { color: colors.text }]}>
              Aquí puedes gestionar tus datos de envío para tus pedidos:
            </Text>

            <View style={styles.field}>
              {/* 🔹 DIRECCIONES DINÁMICAS */}
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

              <TouchableOpacity
                onPress={handleAddAddress}
                style={{
                  backgroundColor: colors.text,
                  borderRadius: 10,
                  padding: 12,
                  alignItems: "center",
                  marginTop: 10,
                  marginVertical: 10
                }}
              >
                <Text style={{ color: colors.background, fontFamily: 'Jost_700Bold', textTransform: 'uppercase', width: '100%', textAlign: 'center' }}>
                  + Añadir dirección
                </Text>
              </TouchableOpacity>

              {/* 🔹 BLOQUE WHATSAPP */}
              <WhatsappBlock />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.text }]}
        onPress={() =>
          navigation.navigate("Nuestros Cafés", { screen: "Carrito" })
        }
      >
        <Text style={[styles.buttonText, { color: colors.background }]}>
          Ir a tu carrito
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-start", paddingBottom: 20 },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textTransform: "uppercase",
    textAlign: "center",
    fontFamily: "Jost_700Bold",
    padding: 10,
  },
  text: {
    fontSize: 16,
    padding: 20,
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
});
