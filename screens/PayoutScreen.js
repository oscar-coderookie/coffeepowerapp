import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import CustomHeader from "../components/CustomHeader";
import { useTheme } from "@react-navigation/native";
import ButtonGeneral from "../components/ButtonGeneral";

export default function PayoutScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { cartItems = [], shippingData = {}, paymentData = {} } = route.params || {};

  const [shippingCost, setShippingCost] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const baseShipping = shippingData?.deliveryType === "prioritaria" ? 6 : 3;
      setShippingCost(baseShipping);

      const subtotal = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return sum + price * quantity;
      }, 0);

      setTotal(subtotal + baseShipping);
      setLoading(false);
    } catch (error) {
      console.error("Error calculando totales:", error);
      setLoading(false);
    }
  }, [cartItems, shippingData]);

  const handleFinish = () => {
    navigation.navigate("OrderSuccess", { total });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6f4e37" />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Completar orden" showBack={true} />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Resumen del pedido</Text>

      {cartItems.map((item, idx) => (
        <View key={idx} style={styles.item}>
          <Text style={[styles.itemText, { color: colors.text }]}>
            {item.name} 300gr. × {item.quantity}
          </Text>
          <Text style={[styles.price, { color: colors.text }]}>
            €{((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)).toFixed(2)}
          </Text>
        </View>
      ))}

      <View style={styles.divider} />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>datos de Envío y pago:</Text>
      <View style={styles.row}>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Dirección de entrega:
        </Text>
        <Text style={[styles.detailsText, { color: colors.text }]}>
          {shippingData.address
            ? `${shippingData.address.calle}, ${shippingData.address.numero}, Piso ${shippingData.address.piso}\n${shippingData.address.provincia}, ${shippingData.address.CA}\nCódigo Postal: ${shippingData.address.codigoPostal}`
            : "No especificada"}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Número de contacto:
        </Text>
        <Text style={[styles.detailsText, { color: colors.text }]}>
          +{shippingData.phone.codigo} {shippingData.phone.numero}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Correo Electrónico:
        </Text>
        <Text style={[styles.detailsText, { color: colors.text }]}>
          {shippingData.email}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Tipo de entrega:
        </Text>
        <Text style={[styles.detailsText, { color: colors.text }]}>
          {shippingData?.deliveryType || "No definido"}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Método de pago:
        </Text>
        <Text style={[styles.detailsText, { color: colors.text }]}>
         {paymentData?.method || "No seleccionado"}
        </Text>
      </View>


      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>
          Gastos de envío: Entrega ({shippingData?.deliveryType}):
        </Text>
        <Text style={[styles.value, { color: colors.text }]}>
          €{(shippingCost || 0).toFixed(2)}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.total, { color: colors.text }]}>Total</Text>
        <Text style={[styles.total, { color: colors.text }]}>
          €{(total || 0).toFixed(2)}
        </Text>
      </View>

      <ButtonGeneral
        text="Finalizar Pedido"
        textColor={colors.background}
        bckColor={colors.text}
        onPress={handleFinish}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,

  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  itemText: {
    fontFamily: "Jost_400Regular",
    fontSize: 16,
  },
  price: {
    fontFamily: "Jost_500Medium",
    fontSize: 16,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginVertical: 15,
  },
  sectionTitle: {
    fontFamily: "Jost_600SemiBold",
    fontSize: 18,
    marginBottom: 8,
    marginTop: 10,
    textTransform: 'uppercase'
  },
  detailsText: {
    fontFamily: "Jost_400Regular",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 4,
    textAlign: 'right'
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    alignItems: 'center'
  },
  label: {
    fontFamily: "Jost_400Regular",
    fontSize: 15,
  },
  value: {
    fontFamily: "Jost_500Medium",
    fontSize: 15,
  },
  total: {
    fontFamily: "Jost_700Bold",
    fontSize: 18,
    textTransform: 'uppercase',
    width: '82%'
  },
  subtitle: {
    fontFamily: 'Jost_600SemiBold'
  }
});
