import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import Icon from "react-native-vector-icons/FontAwesome6";
import Icon2 from "react-native-vector-icons/FontAwesome";
import CustomHeader from "../../components/CustomHeader";
import ButtonGeneral from "../../components/ButtonGeneral";
import PaymentSelector from "../../components/PaymentSelector";
import CouponSelectorModal from "../../components/CouponsSelectorModal";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { MotiView } from "moti";

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
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);

const handleApplyCoupon = async () => {
  if (!user) {
    Alert.alert("Inicia sesión", "Debes iniciar sesión para aplicar cupones.");
    return;
  }

  try {
    // Ahora sí: leer subcolección
    const couponsRef = collection(db, "users", user.uid, "coupons");
    const snapshot = await getDocs(couponsRef);

    const coupons = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const validCoupons = coupons.filter(c =>
      !c.used &&
      (!c.expiresAt || new Date(c.expiresAt) > new Date())
    );

    setAvailableCoupons(validCoupons);
    setShowCouponModal(true);

  } catch (error) {
    console.error("Error al obtener cupones:", error);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "No se pudieron cargar los cupones.",
    });
  }
};


  const handleContinue = () => {
    const selectedAddress = directions.find((dir) => dir.id === selected);
    if (!selectedAddress) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Por favor. Selecciona una dirección de entrega",
      });
      return;
    }

    const shippingData = {
      address: selectedAddress,
      deliveryType,
      phone,
      email,
      appliedCoupon,
    };

    const paymentData = { method: paymentMethod };

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
          const addressesRef = collection(db, "users", currentUser.uid, "addresses");
          const snapshot = await getDocs(addressesRef);
          const dirs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setDirections(dirs);
          if (dirs.length === 1) setSelected(dirs[0].id);

          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.phone) setPhone(data.phone);
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
    <SafeAreaView style={[styles.container]} edges={['bottom']}>
      <CustomHeader title="Datos de Envío y pago" showBack={true} />

      {user ? (
        <ScrollView style={{ marginVertical: 10, marginHorizontal: 10 }}>
          <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 150, duration: 300 }}>
            <Text style={[styles.title, { color: colors.text }]}>
              Seleccionar dirección de entrega:
            </Text>
          </MotiView>

          {directions.map((item, index) => (
            <MotiView key={item.id} from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 200 + index * 100, duration: 500 }}>
              <View style={{ borderColor: colors.text, borderWidth: 1, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                <View>
                  <Text style={{ fontFamily: "Jost_600SemiBold", color: colors.text }}>
                    Dirección de entrega {index + 1}:
                  </Text>
                  <Text style={{ fontFamily: "Jost_400Regular", color: colors.text }}>
                    Calle: {item.calle}, {item.numero}, Piso {item.piso}
                  </Text>
                  <Text style={{ fontFamily: "Jost_400Regular", color: colors.text }}>
                    {item.provincia}, {item.CA}
                  </Text>
                  <Text style={{ fontFamily: "Jost_400Regular", color: colors.text }}>
                    Código Postal: {item.codigoPostal}
                  </Text>
                </View>

                <TouchableOpacity onPress={() => setSelected(item.id)} style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon2 name={selected === item.id ? "dot-circle-o" : "circle-o"} size={22} color={colors.text} style={{ marginRight: 10 }} />
                </TouchableOpacity>
              </View>
            </MotiView>
          ))}

          {/* Tipo de entrega */}
          <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 400, duration: 600 }}>
            <Text style={[styles.title, { color: colors.text }]}>Seleccionar tipo de entrega:</Text>

            {[{ id: "Estándar", label: "Entrega Estándar (3-5 días)", icon: "truck" }, { id: "VIP", label: "Entrega VIP (El mismo día)", icon: "crown" }].map((option) => (
              <TouchableOpacity key={option.id} onPress={() => setDeliveryType(option.id)} style={{ borderColor: deliveryType === option.id ? colors.gold : colors.text, borderWidth: 1, backgroundColor: deliveryType === option.id ? colors.gold : colors.text, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon name={option.icon} size={18} color={colors.background} style={{ marginRight: 10 }} />
                  <Text style={{ fontFamily: "Jost_600SemiBold", color: colors.background }}>{option.label}</Text>
                </View>
                <Icon2 name={deliveryType === option.id ? "dot-circle-o" : "circle-o"} size={22} color={colors.background} />
              </TouchableOpacity>
            ))}
          </MotiView>

          {/* Cupón */}
          <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 600, duration: 600 }}>
            <Text style={[styles.title, { color: colors.text }]}>¿Tienes un cupón de descuento?</Text>
            <TouchableOpacity onPress={handleApplyCoupon} style={{ borderWidth: 1, borderColor: colors.text, borderRadius: 10, padding: 15, backgroundColor: colors.background, marginBottom: 14 }}>
              <Text style={{ color: colors.text, fontFamily: "Jost_400Regular" }}>
                {appliedCoupon ? `Cupón "${appliedCoupon.code}" aplicado (${appliedCoupon.discount}%) 🎉` : "Seleccionar cupón disponible"}
              </Text>
            </TouchableOpacity>

            <CouponSelectorModal visible={showCouponModal} onClose={() => setShowCouponModal(false)} coupons={availableCoupons} colors={colors} onSelect={(coupon) => { setAppliedCoupon(coupon); setShowCouponModal(false); Toast.show({ type: "success", text1: "Cupón aplicado", text2: `Descuento del ${coupon.discount}% activado 🎉` }) }} />
          </MotiView>

          {/* Método de pago */}
          <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 800, duration: 600 }}>
            <PaymentSelector selectedMethod={paymentMethod} onSelect={setPaymentMethod} />
          </MotiView>

          {/* Botón */}
          <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 1000, duration: 600 }}>
            <ButtonGeneral onTouch={handleContinue} text="Continuar al pago" textColor="#000000ff" borderColors={[colors.goldSecondary, colors.gold, colors.goldSecondary, colors.gold, colors.goldSecondary]} bckColor={[colors.gold, colors.goldSecondary, colors.gold, colors.goldSecondary, colors.gold]} soundType="click" />
          </MotiView>
        </ScrollView>
      ) : (
        <View style={styles.form}>
          {[{ placeholder: "Nombre completo", value: name, onChange: setName }, { placeholder: "Dirección de entrega", value: address, onChange: setAddress }, { placeholder: "Detalles adicionales (Apto, piso...)", value: details, onChange: setDetails }, { placeholder: "Teléfono", value: phone, onChange: setPhone, keyboardType: "phone-pad" }, { placeholder: "Email", value: email, onChange: setEmail, keyboardType: "email-address" }].map((field, i) => (
            <MotiView key={i} from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 300 + i * 100, duration: 500 }}>
              <TextInput style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.input }]} placeholder={field.placeholder} value={field.value} placeholderTextColor={colors.text} onChangeText={field.onChange} keyboardType={field.keyboardType || "default"} />
            </MotiView>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 18, fontFamily: "Jost_600SemiBold", marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 20, fontFamily: "Jost_400Regular" },
  input: { padding: 15, borderRadius: 10, fontSize: 16, borderWidth: 1, marginTop: 10, marginBottom: 10, fontFamily: "Jost_400Regular" },
  form: { paddingTop: 40, padding: 20 },
});
