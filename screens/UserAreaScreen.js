import React, { useContext, useEffect, useState } from "react";
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
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
      return "ES"; // por defecto España
  }
};

  // 🔹 Verificar sesión y cargar datos
  useEffect(() => {
    const verifySession = async () => {
      try {
        const session = await AsyncStorage.getItem("userSession");
        if (!session) {
          navigation.replace("Login");
          return;
        }

        const { name, email } = JSON.parse(session);
        setUserName(name);
        setUserEmail(email);

        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.phone && typeof data.phone === "object") {
              setPhone({
                codigo: data.phone.codigo || "34",
                numero: data.phone.numero || "",
              });
              setCountryCode(getCountryCodeFromCallingCode(data.phone.codigo));
            } else {
              // Para compatibilidad si antes había string
              setPhone({ codigo: "34", numero: "" });
            }
          } else {
            await setDoc(userRef, { phone: "" });
          }

          // 🔹 Cargar direcciones desde la subcolección
          await fetchAddresses();
        }
      } catch (error) {
        console.log("Error verificando sesión:", error);
        navigation.replace("Login");
      } finally {
        setCheckingAuth(false);
      }
    };
    verifySession();
  }, []);

  // 🔹 Obtener direcciones del usuario
  const fetchAddresses = async () => {
    if (!user) return;
    try {
      const snapshot = await getDocs(collection(db, `users/${user.uid}/addresses`));
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

      setEditingId(docRef.id); // 🔹 activa edición automática para esta dirección
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
                  isEditingAddress={editingId === item.id} // 🔹 solo este entra en edición
                  setIsEditingAddress={(value) => {
                    if (!value) setEditingId(null); // si termina de editar, limpiamos
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
                <Text style={{ color: colors.background, fontFamily: 'Jost_700Bold', textTransform: 'uppercase', width: ' 100%', textAlign: 'center' }}>
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
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
    fontFamily: "Jost_400Regular",
    width: "100%",
    backgroundColor: "transparent",
  },
  editBtn: { borderWidth: 1, borderRadius: 8, padding: 14 },
  addressBox: {
    width: "100%",
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  addressTitle: {
    fontSize: 16,
    fontFamily: "Jost_700Bold",
    color: "#a88e19",
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
  },
  addressRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  addressLabel: {
    fontFamily: "Jost_600SemiBold",
    color: "#fff",
    width: 120,
    fontSize: 14,
  },
  phoneRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  addressValue: {
    fontFamily: "Jost_600SemiBold",
    color: "#ccc",
    fontSize: 14,
    flex: 1,
  },
  buttonText: {
    fontFamily: "Jost_700Bold",
    textTransform: "uppercase",
    textAlign: "center",
  },
  infoContainer: { width: "100%" },
  field: {

    width: "100%",
    justifyContent: "center",
    padding: 10,
  },
});
