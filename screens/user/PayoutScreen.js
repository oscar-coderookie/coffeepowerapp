import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import CustomHeader from "../../components/CustomHeader";
import { useTheme } from "@react-navigation/native";
import ButtonGeneral from "../../components/ButtonGeneral";
import LoadingScreen from "../../components/LoadingScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import { useUser } from "../../context/UserContext";
import { createOrder } from "../../services/checkoutService";

export default function PayoutScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { cartItems = [], shippingData = {}, paymentData = {} } = route.params || {};
  const appliedCoupon = shippingData?.appliedCoupon || null;
  const { userData } = useUser()
  const [shippingCost, setShippingCost] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const baseShipping = shippingData?.deliveryType === "VIP" ? 6 : 3;
      setShippingCost(baseShipping);

      const calculatedSubtotal = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return sum + price * quantity;
      }, 0);

      const discountPercent = appliedCoupon?.discount || 0;
      const discountValue = calculatedSubtotal * (discountPercent / 100);
      const totalWithDiscount = calculatedSubtotal - discountValue + baseShipping;

      setSubtotal(calculatedSubtotal);
      setDiscountAmount(discountValue);
      setTotal(totalWithDiscount);

      setTimeout(() => setLoading(false), 1000);
    } catch (error) {
      console.error("Error calculando totales:", error);
      setLoading(false);
    }
  }, [cartItems, shippingData]);

  const handleFinish = async () => {
    try {
      const orderId = await createOrder(
        userData.uid,
        userData,
        shippingData,
        paymentData,
        cartItems,
        { subtotal, discountAmount, shippingCost, total }
      );

      navigation.navigate("OrderSuccess", { userId: userData.uid, orderId });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <CustomHeader title="Completar orden" showBack={true} />
      <ScrollView contentContainerStyle={{ paddingBottom: 30, marginHorizontal: 10 }}>

        {/* BLOQUE 1 - Resumen */}
        <MotiView
          from={{ translateX: -100, opacity: 0 }}
          animate={{ translateX: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 500 }}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Resumen del pedido</Text>
          {cartItems.map((item, idx) => (
            <View key={idx} style={styles.item}>
              <Text style={[styles.itemText, { color: colors.text }]}>
                {item.name} 300gr × {item.quantity}
              </Text>
              <Text style={[styles.price, { color: colors.text }]}>
                €{(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}
              </Text>
            </View>
          ))}
        </MotiView>

        <View style={styles.divider} />

        {/* BLOQUE 2 - Datos de envío */}
        <MotiView
          from={{ translateX: -100, opacity: 0 }}
          animate={{ translateX: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 500, delay: 400 }}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Datos de envío y pago</Text>
          <View style={styles.row}>
            <Text style={[styles.subtitle, { color: colors.text }]}>Dirección:</Text>
            <Text style={[styles.detailsText, { color: colors.text }]}>
              {shippingData.address
                ? `${shippingData.address.calle}, ${shippingData.address.numero}, Piso ${shippingData.address.piso}\n${shippingData.address.provincia}, ${shippingData.address.CA}\nCP: ${shippingData.address.codigoPostal}`
                : "No especificada"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.subtitle, { color: colors.text }]}>Número de contacto:</Text>
            <Text style={[styles.detailsText, { color: colors.text }]}>
              +{shippingData?.phone?.codigo || ""} {shippingData?.phone?.numero || ""}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.subtitle, { color: colors.text }]}>Correo Electrónico:</Text>
            <Text style={[styles.detailsText, { color: colors.text }]}>{shippingData.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.subtitle, { color: colors.text }]}>Método de pago:</Text>
            <Text style={[styles.detailsText, { color: colors.text }]}>
              {paymentData?.method || "No seleccionado"}
            </Text>
          </View>
        </MotiView>

        <View style={styles.divider} />

        {/* BLOQUE 3 - Totales */}
        <MotiView
          from={{ translateX: -100, opacity: 0 }}
          animate={{ translateX: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 500, delay: 800 }}
        >
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Subtotal:</Text>
            <Text style={[styles.value, { color: colors.text }]}>€{subtotal.toFixed(2)}</Text>
          </View>

          {appliedCoupon && (
            <View style={styles.row}>
              <Text style={[styles.label, { color: colors.text }]}>
                Cupón ({appliedCoupon.code}):
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                -{appliedCoupon.discount}% ({discountAmount.toFixed(2)}€)
              </Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Gastos de envío:</Text>
            <Text style={[styles.value, { color: colors.text }]}>€{shippingCost.toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.total, { color: colors.text }]}>Total</Text>
            <Text style={[styles.total, { color: colors.text }]}>€{total.toFixed(2)}</Text>
          </View>

          <ButtonGeneral
            text="Finalizar Pedido"
            textColor="#000000ff"
            bckColor={[colors.gold, colors.goldSecondary, colors.gold, colors.goldSecondary, colors.gold]}
            onTouch={handleFinish}
          />
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
  sectionTitle: {
    fontFamily: "Jost_600SemiBold",
    fontSize: 18,
    marginVertical: 8,
    textTransform: "uppercase",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  itemText: { fontFamily: "Jost_400Regular", fontSize: 16 },
  price: { fontFamily: "Jost_500Medium", fontSize: 16 },
  divider: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    alignItems: "center",
  },
  label: { fontFamily: "Jost_400Regular", fontSize: 15 },
  value: { fontFamily: "Jost_500Medium", fontSize: 15 },
  total: {
    fontFamily: "Jost_700Bold",
    fontSize: 18,
    textTransform: "uppercase",
    width: "82%",
  },
  subtitle: { fontFamily: "Jost_600SemiBold" },
  detailsText: {
    fontFamily: "Jost_400Regular",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "right",
  },
});
