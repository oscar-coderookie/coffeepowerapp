import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme, useRoute } from "@react-navigation/native";
import CustomHeader from "../../components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";

export default function OrderDetailScreen() {
  const { colors } = useTheme();
  const route = useRoute();
  const { order } = route.params;

  const address = order.shippingAddress;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title={`Pedido #${order.orderIndex}`} showBack />

      <ScrollView contentContainerStyle={{ padding: 20 }}>

        {/* CARD PRINCIPAL */}
        <LinearGradient
          colors={[colors.card, colors.background, colors.card]}
          style={styles.mainCard}
        >
          <View style={styles.row}>
            <Ionicons name="receipt-outline" size={28} color={colors.text} />
            <Text style={styles.title}>Detalles del Pedido</Text>
          </View>

          {/* Datos esenciales */}
          <Info label="ID del pedido" value={order.orderId} colors={colors} />
          <Info label="Estado" value={order.status} colors={colors} />
          <Info label="Fecha de creación" value={order.createdAt?.toDate().toLocaleString()} colors={colors} />
          <Info label="Última actualización" value={order.updatedAt?.toDate().toLocaleString()} colors={colors} />
        </LinearGradient>

        {/* INFORMACIÓN DEL CLIENTE */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Cliente</Text>
        <LinearGradient colors={[colors.card, colors.background, colors.card]} style={styles.card}>
          <Info label="Nombre" value={order.userName} colors={colors} />
          <Info label="Email" value={order.email} colors={colors} />
          <Info label="Teléfono" value={`+${order.phone.codigo} ${order.phone.numero}`} colors={colors} />
        </LinearGradient>

        {/* DIRECCIÓN DE ENVÍO */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Dirección de envío</Text>
        <LinearGradient colors={[colors.card, colors.background, colors.card]} style={styles.card}>
          <Info
            label="Dirección"
            value={`${address.calle}, ${address.numero}${address.piso ? `, Piso ${address.piso}` : ""}${address.puerta ? `, Puerta ${address.puerta}` : ""}`}
            colors={colors}
          />

          <View style={{ flexDirection: 'row', justifyContent:'space-between' }}>
            <Info label="Provincia" value={address.provincia} colors={colors} />
            <Info label="Comunidad Autónoma" value={address.CA} colors={colors} />
                <Info label="Código Postal" value={address.codigoPostal} colors={colors} />
          </View>
      
          <Info label="Referencia" value={address.referencia} colors={colors} />
        </LinearGradient>

        {/* PRODUCTOS */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Productos</Text>
        {order.items?.map((item, index) => (
          <LinearGradient key={index} colors={[colors.card, colors.background, colors.card]} style={styles.productCard}>
            <View style={styles.rowBetween}>
              <Text style={[styles.productName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.productPrice, { color: colors.text }]}>Cant: {item.quantity}</Text>
            </View>
            <Text style={[styles.productSub, { color: colors.text }]} >
              Subtotal: € {item.subtotal?.toFixed(2)}
            </Text>
          </LinearGradient>
        ))}

        {/* RESUMEN PROFESIONAL */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Resumen</Text>
        <LinearGradient colors={[colors.card, colors.background, colors.card]} style={styles.card}>
          <Info label="Subtotal" value={`€ ${order.subtotal?.toFixed(2)}`} colors={colors} />
          <Info label="Descuento" value={`€ ${order.discountAmount?.toFixed(2)}`} colors={colors} />
          <Info label="Costo de envío" value={`€ ${order.shippingCost?.toFixed(2)}`} colors={colors} />
          <Info label="Método de envío" value={order.shippingMethod} colors={colors} />
          <Info label="Total final" value={`€ ${order.total?.toFixed(2)}`} colors={colors} bold />
        </LinearGradient>

        {/* PAGO */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Pago</Text>
        <LinearGradient colors={[colors.card, colors.background, colors.card]} style={styles.card}>
          <Info label="Método de pago" value={order.paymentMethod} colors={colors} />
          <Info label="Estado del pago" value={order.paymentStatus} colors={colors} />
          <Info label="Transacción ID" value={order.paymentTransactionId} colors={colors} />
        </LinearGradient>

      </ScrollView>
    </View>
  );
}

/* Componente pequeño reutilizable */
function Info({ label, value, bold, colors }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={[styles.fieldLabel, { color: colors.text }]}>{label}</Text>
      <Text
        style={[
          styles.fieldValue,
          { color: colors.text },
          bold && { fontFamily: "Jost_700Bold" }
        ]}
      >
        {value || "—"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  mainCard: {
    padding: 20,
    borderRadius: 35,
    marginBottom: 25,
  },

  card: {
    padding: 18,
    borderRadius: 30,
    marginBottom: 20,
  },

  title: {
    marginLeft: 10,
    fontSize: 18,
    fontFamily: "Jost_700Bold",
  },

  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
    fontFamily: "Jost_700Bold",
  },

  fieldLabel: {
    fontSize: 13,
    opacity: 0.7,
    fontFamily: "Jost_400Regular",
  },

  fieldValue: {
    fontSize: 15,
    fontFamily: "Jost_500Medium",
  },

  productCard: {
    padding: 15,
    borderRadius: 22,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  productName: {
    fontSize: 15,
    fontFamily: "Jost_600SemiBold",
  },

  productPrice: {
    fontSize: 14,
    opacity: 0.8,
    fontFamily: "Jost_400Regular",
  },

  productSub: {
    marginTop: 6,
    fontSize: 14,
    fontFamily: "Jost_500Medium",
  },
});
