// screens/CheckoutScreen.js
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import CustomHeader from "../components/CustomHeader";
import { useTheme } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from '../config/firebase'
import Icon from "react-native-vector-icons/FontAwesome6";
import Icon2 from "react-native-vector-icons/FontAwesome";
import ButtonGeneral from "../components/ButtonGeneral";
import { Modal } from "react-native";
import PaymentSelector from "../components/PaymentSelector";

//modal de confirmacion:
function ConfirmModal({ visible, onClose, address, deliveryType, onConfirm, colors }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={modalStyles.overlay}>
        <View style={[modalStyles.container, { backgroundColor: colors.background }]}>
          <Text style={[modalStyles.title, { color: colors.text }]}>
            Confirmar pedido
          </Text>

          {/* Dirección seleccionada */}
          <View style={modalStyles.section}>
            <Text style={[modalStyles.label, { color: colors.text }]}>
              📍 Dirección de entrega:
            </Text>
            <Text style={[modalStyles.value, { color: colors.text }]}>
              {address
                ? `${address.calle}, ${address.numero}, Piso ${address.piso}\n${address.provincia}, ${address.CA}\nCódigo Postal: ${address.codigoPostal}`
                : "No se ha seleccionado dirección"}
            </Text>
          </View>

          {/* Tipo de entrega */}
          <View style={modalStyles.section}>
            <Text style={[modalStyles.label, { color: colors.text }]}>
              🚚 Tipo de entrega:
            </Text>
            <Text style={[
              modalStyles.value,
              {
                color: deliveryType === "prioritaria" ? "#8a6d0dff" : colors.text,
                fontFamily: 'Jost_600SemiBold'
              }
            ]}>
              {deliveryType === "prioritaria"
                ? "Entrega VIP (El mismo día)"
                : "Entrega normal (3-5 días)"}
            </Text>
          </View>

          {/* Botones */}
          <View style={modalStyles.buttons}>
            <TouchableOpacity
              style={[modalStyles.cancelBtn, { borderColor: colors.text }]}
              onPress={onClose}
            >
              <Text style={[modalStyles.cancelText, { color: colors.text }]}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[modalStyles.confirmBtn, { backgroundColor: "#8a6d0dff" }]}
              onPress={onConfirm}
            >
              <Text style={[modalStyles.confirmText, { color: colors.background }]}>
                Confirmar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 20,
  },
  container: {
    width: "100%",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontFamily: "Jost_600SemiBold",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontFamily: "Jost_600SemiBold",
    fontSize: 16,
    marginBottom: 5,
  },
  value: {
    fontFamily: "Jost_400Regular",
    fontSize: 15,
    lineHeight: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
  },
  confirmBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
  },
  cancelText: {
    textAlign: "center",
    fontFamily: "Jost_600SemiBold",
  },
  confirmText: {
    textAlign: "center",
    fontFamily: "Jost_600SemiBold",
  },
});

const PaymentMethods = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const { colors } = useTheme();

  return (
    <View style={payStyles.infoContainer}>
      <View style={payStyles.inputContainer}>
        <Text style={payStyles.label}>Nombre en la tarjeta</Text>
        <TextInput
          style={[payStyles.input, { color: colors.text, backgroundColor: colors.background }]}
          placeholder="Ej: Óscar Serna"
          placeholderTextColor={colors.text}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={payStyles.inputContainer}>
        <Text style={payStyles.label}>Número de tarjeta</Text>
        <TextInput
          style={[payStyles.input, { color: colors.text, backgroundColor: colors.background }]}
          placeholder="1234 5678 9012 3456"
          placeholderTextColor={colors.text}
          keyboardType="numeric"
          value={cardNumber}
          onChangeText={setCardNumber}
        />
      </View>

      <View style={payStyles.row}>
        <View style={[payStyles.inputContainer, { flex: 1, marginRight: 10 }]}>
          <Text style={payStyles.label}>Expira</Text>
          <TextInput
            style={[payStyles.input, { color: colors.text, backgroundColor: colors.background }]}
            placeholder="MM/AA"
            placeholderTextColor={colors.text}
            keyboardType="numeric"
            value={expiry}
            onChangeText={setExpiry}
          />
        </View>

        <View style={[payStyles.inputContainer, { flex: 1 }]}>
          <Text style={payStyles.label}>CVV</Text>
          <TextInput
            style={[payStyles.input, { color: colors.text, backgroundColor: colors.background }]}
            placeholder="***"
            placeholderTextColor={colors.text}
            secureTextEntry
            keyboardType="numeric"
            value={cvv}
            onChangeText={setCvv}
          />
        </View>
      </View>
    </View>

  )
}

const payStyles = StyleSheet.create({
  container: {

  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: { marginBottom: 20 },
  label: { marginBottom: 6, fontSize: 14, fontFamily: 'Jost_400Regular' },
  input: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    fontFamily: 'Jost_400Regular',
    borderRadius: 10,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  row: { flexDirection: "row" },
  payButton: {
    backgroundColor: "#8a6d0d",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  payText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  infoContainer: {
    marginVertical: 10
  }
});

export default function CheckoutScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { cartItems } = route.params;
  const [selected, setSelected] = useState(null);
  const [user, setUser] = useState(null);
  const [deliveryType, setDeliveryType] = useState("normal");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [directions, setDirections] = useState([]);
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Tarjeta");

  const handleContinue = () => {
    // Buscar la dirección completa según el ID seleccionado
    const selectedAddress = directions.find(dir => dir.id === selected);

    if (!selectedAddress) {
      Alert.alert("Selecciona una dirección de entrega");
      return;
    }

    const shippingData = {
      address: selectedAddress,
      deliveryType,
      phone,
      email

    };

    const paymentData = {
      method: paymentMethod,
    };

    navigation.navigate("Payout", {
      cartItems,
      shippingData,
      paymentData,
    });
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          // 🔹 Cargar direcciones guardadas
          const addressesRef = collection(db, "users", currentUser.uid, "addresses");
          const snapshot = await getDocs(addressesRef);
          const directions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setDirections(directions);

          if (directions.length === 1) {
            setSelected(directions[0].id);
          }

          // 🔹 NUEVO: Traer teléfono del documento del usuario
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.phone) {
              setPhone(data.phone); // { countryCode: "+34", number: "600123456" }
            }
            if (data.name) setName(data.name);
            if (data.email) setEmail(data.email);
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
        }
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <CustomHeader
        title='Datos de Envío y pago'
        showBack={true}
      />

      {user ? (
        // 🔥 Si el usuario está logueado, muestra sus direcciones
        <ScrollView style={{ marginVertical: 10, marginHorizontal: 10 }}>
          <Text style={{ fontSize: 18, fontFamily: 'Jost_600SemiBold', marginBottom: 8, color: colors.text }}>
            Seleccionar dirección de entrega:
          </Text>
          {directions.map((item, index) => {
            return (

              <View style={{ borderColor: colors.text, borderWidth: 1, padding: 10, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between' }} key={index}>

                <View>
                  <Text style={{ fontFamily: 'Jost_600SemiBold', color: colors.text }}>Direccion de entrega 1:</Text>
                  <Text style={{ fontFamily: 'Jost_400Regular', color: colors.text }}>
                    Calle: {item.calle}, {item.numero}, Piso {item.piso}
                  </Text>
                  <Text style={{ fontFamily: 'Jost_400Regular', color: colors.text }}>{item.provincia}, {item.CA}</Text>
                  <Text style={{ fontFamily: 'Jost_400Regular', color: colors.text }}>Codigo Postal: {item.codigoPostal}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelected(item.id)}
                  style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}
                >
                  <Icon2
                    name={selected === item.id ? "dot-circle-o" : "circle-o"}
                    size={22}
                    color={colors.text}
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>
              </View>
            )
          })}
          {/* 🔹 Selector de tipo de entrega */}
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 18, fontFamily: 'Jost_600SemiBold', marginBottom: 8, color: colors.text }}>
              Seleccionar tipo de entrega:
            </Text>

            {[
              { id: "Estándar", label: "Entrega Estándar (3-5 días)", icon: "truck" },
              { id: "VIP", label: "Entrega VIP (El mismo día)", icon: "crown", backgroundColor: "#8a6d0dff" },
            ].map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => setDeliveryType(option.id)}
                style={{
                  borderColor: deliveryType === option.id ? "#8a6d0dff" : colors.text,
                  borderWidth: 1,
                  backgroundColor: deliveryType === option.id ? "#8a6d0dff" : colors.text,
                  padding: 10,
                  borderRadius: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon name={option.icon} size={18} color={colors.background} style={{ marginRight: 10 }} />
                  <Text style={{ fontFamily: 'Jost_600SemiBold', color: colors.background, }}>{option.label}</Text>
                </View>

                <Icon2
                  name={deliveryType === option.id ? "dot-circle-o" : "circle-o"}
                  size={22}
                  color={colors.background}
                />
              </TouchableOpacity>
            ))}
          </View>
          <PaymentSelector selectedMethod={paymentMethod}
            onSelect={setPaymentMethod} />
          <ButtonGeneral
            onTouch={handleContinue}
            text='Continuar al pago'
            textColor={colors.background}
            bckColor={colors.text}
          />
        </ScrollView>
      ) : (
        // 👤 Si NO está logueado, muestra el formulario de invitado
        <View style={styles.form}>
          <Text style={{
            fontSize: 16,
            marginBottom: 20,
            color: colors.text,
            fontFamily: 'Jost_400Regular',
          }}>Introduce los datos para tu pedido:</Text>
          <TextInput
            style={{
              backgroundColor: colors.input,
              padding: 15,
              borderRadius: 10,
              color: colors.text,
              fontSize: 16,
              borderWidth: 1,
              borderColor: colors.input,
              marginTop: 10,
              marginBottom: 10,
              fontFamily: 'Jost_400Regular'
            }}
            placeholder="Nombre completo"
            value={name}
            placeholderTextColor={colors.text}
            onChangeText={setName}
          />

          <TextInput
            style={{
              backgroundColor: colors.input,
              padding: 15,
              borderRadius: 10,
              color: colors.text,
              fontSize: 16,
              borderWidth: 1,
              borderColor: colors.input,
              marginTop: 10,
              marginBottom: 10,
              fontFamily: 'Jost_400Regular'
            }}
            placeholder="Dirección de entrega"
            value={address}
            placeholderTextColor={colors.text}
            onChangeText={setAddress}
          />

          <TextInput
            style={{
              backgroundColor: colors.input,
              padding: 15,
              borderRadius: 10,
              color: colors.text,
              fontSize: 16,
              borderWidth: 1,
              borderColor: colors.input,
              marginTop: 10,
              marginBottom: 10,
              fontFamily: 'Jost_400Regular'
            }}
            placeholder="Detalles adicionales (Apto, piso, referencias...)"
            placeholderTextColor={colors.text}
            value={details}
            onChangeText={setDetails}
          />

          <TextInput
            style={{
              backgroundColor: colors.input,
              padding: 15,
              borderRadius: 10,
              color: colors.text,
              fontSize: 16,
              borderWidth: 1,
              borderColor: colors.input,
              marginTop: 10,
              marginBottom: 10,
              fontFamily: 'Jost_400Regular'
            }}
            placeholder="Teléfono"
            placeholderTextColor={colors.text}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <TextInput
            style={{
              backgroundColor: colors.input,
              padding: 15,
              borderRadius: 10,
              color: colors.text,
              fontSize: 16,
              borderWidth: 1,
              borderColor: colors.input,
              marginTop: 10,
              marginBottom: 10,
              fontFamily: 'Jost_400Regular'
            }}
            placeholderTextColor={colors.text}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8a6d0dff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,

  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textTransform: 'uppercase',
    fontFamily: 'Jost_600SemiBold'

  },
  form: {
    paddingTop: 40,
    padding: 20,

  }
});
