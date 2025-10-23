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
import PaymentSelector from "../components/PaymentSelector";
import CouponSelectorModal from "../components/CouponsSelectorModal";


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
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  const handleApplyCoupon = async () => {
    if (!user) {
      Alert.alert("Inicia sesión", "Debes iniciar sesión para aplicar cupones.");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        Alert.alert("Error", "No se encontró tu perfil de usuario.");
        return;
      }

      const userData = userSnap.data();
      const coupons = (userData.coupons || []).filter(
        (c) => !c.used && (!c.expiresAt || new Date(c.expiresAt) > new Date())
      );

      setAvailableCoupons(coupons);
      setShowCouponModal(true);
    } catch (error) {
      console.error("Error al obtener cupones:", error);
      Alert.alert("Error", "No se pudieron cargar los cupones.");
    }
  };




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
      email,
      appliedCoupon,
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
          {/* 🔹 Campo para aplicar cupón de descuento */}
          <View style={{ marginBottom: 14 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Jost_600SemiBold",
                marginBottom: 8,
                color: colors.text,
              }}
            >
              ¿Tienes un cupón de descuento?
            </Text>

            <TouchableOpacity
              onPress={handleApplyCoupon}
              style={{
                borderWidth: 1,
                borderColor: colors.text,
                borderRadius: 10,
                padding: 15,
                backgroundColor: colors.background,
              }}
            >
              <Text style={{ color: colors.text, fontFamily: "Jost_400Regular" }}>
                {appliedCoupon
                  ? `Cupón "${appliedCoupon.code}" aplicado (${appliedCoupon.discount}%) 🎉`
                  : "Seleccionar cupón disponible"}
              </Text>
            </TouchableOpacity>

            {/* Modal de selección */}
            <CouponSelectorModal
              visible={showCouponModal}
              onClose={() => setShowCouponModal(false)}
              coupons={availableCoupons}
              colors={colors}
              onSelect={(coupon) => {
                setAppliedCoupon(coupon);
                setShowCouponModal(false);
                Alert.alert("Cupón aplicado", `Descuento del ${coupon.discount}% activado 🎉`);
              }}
            />
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
