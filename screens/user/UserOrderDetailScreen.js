import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../../components/CustomHeader";

export default function UserOrderDetailScreen({ route }) {
  const { colors } = useTheme();
  const { order } = route.params; // Recibes el pedido completo desde la lista

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Detalle del pedido" showBack/>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Número de pedido */}
        <View style={styles.section}>
          <Text style={[styles.title, { color: colors.text }]}>
            Pedido #{order.orderNumber}
          </Text>
        </View>

        {/* Información General */}
        <View style={[styles.section, styles.box, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Información general
          </Text>

          <Item label="Estado" value={order.status} colors={colors} />
          <Item label="Fecha" value={order.createdAt?.toDate().toLocaleString()} colors={colors} />
          <Item label="Método de pago" value={order.paymentMethod} colors={colors} />
          <Item label="Método de envío" value={order.shippingMethod} colors={colors} />
          <Item label="Productos distintos" value={order.totalItems ?? order.items?.length} colors={colors} />
        </View>

        {/* Dirección de envío */}
        {order.shippingAddress && (
          <View style={[styles.section, styles.box, { backgroundColor: colors.card }]}>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Dirección de envío
            </Text>

            {/* Línea completa de dirección */}
            <Item
              label="Dirección"
              value={`${order.shippingAddress.calle} ${order.shippingAddress.numero}${order.shippingAddress.piso ? `, Piso ${order.shippingAddress.piso}` : ""
                }${order.shippingAddress.puerta ? `, Puerta ${order.shippingAddress.puerta}` : ""}`}
              colors={colors}
            />

            {/* Provincia + CA */}
            <Item
              label="Provincia y Comunidad"
              value={`${order.shippingAddress.provincia}, ${order.shippingAddress.CA}`}
              colors={colors}
            />

            {/* Código Postal */}
            <Item
              label="Código Postal"
              value={order.shippingAddress.codigoPostal}
              colors={colors}
            />

            {/* Referencia adicional */}
            {order.shippingAddress.referencia && (
              <Item
                label="Referencia"
                value={order.shippingAddress.referencia}
                colors={colors}
              />
            )}

            {/* Teléfono (si lo guardas ahí) */}
            {order.phone && (
              <Item
                label="Teléfono"
                value={order.phone}
                colors={colors}
              />
            )}

          </View>
        )}


        {/* Lista de productos */}
        <View style={[styles.section, styles.box, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Productos del pedido
          </Text>

          {order.products?.map((item, idx) => (
            <View key={idx} style={styles.productItem}>
              <Text style={[styles.productName, { color: colors.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.productDetails, { color: colors.text }]}>
                Cantidad: {item.quantity}  •  Precio: €{item.price.toFixed(2)}
              </Text>
              <Text style={[styles.productSubtotal, { color: colors.text }]}>
                Subtotal: €{item.subtotal.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totales */}
        <View style={[styles.section, styles.box, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Totales
          </Text>

          <Item label="Subtotal" value={`€ ${order.subtotal?.toFixed(2)}`} colors={colors} />
          <Item label="Descuento" value={`€ ${order.discountAmount?.toFixed(2)}`} colors={colors} />
          <Item label="Envío" value={`€ ${order.shippingCost?.toFixed(2)}`} colors={colors} />
          <Item
            label="Total a pagar"
            value={`€ ${order.total?.toFixed(2)}`}
            bold
            colors={colors}
          />
        </View>

      </ScrollView>
    </View>
  );
}

// Componente reutilizable para pares Label / Valor
function Item({ label, value, bold, colors }) {
  return (
    <View style={styles.itemRow}>
      <Text style={[styles.itemLabel, { color: colors.text }]}>
        {label}:
      </Text>
      <Text
        style={[
          styles.itemValue,
          { color: colors.text },
          bold && { fontFamily: "Jost_700Bold" }
        ]}
      >
        {value ?? "—"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 18 },

  section: { marginBottom: 20 },

  title: {
    fontSize: 22,
    fontFamily: "Jost_700Bold",
  },

  subtitle: {
    fontSize: 14,
    fontFamily: "Jost_400Regular",
    opacity: 0.7,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: "Jost_600SemiBold",
    marginBottom: 12,
  },

  box: {
    padding: 18,
    borderRadius: 20,
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  itemLabel: {
    fontSize: 14,
    fontFamily: "Jost_400Regular",
    opacity: 0.8,
  },

  itemValue: {
    fontSize: 14,
    fontFamily: "Jost_500Medium",
  },

  productItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#3333",
    paddingBottom: 8,
  },

  productName: {
    fontSize: 15,
    fontFamily: "Jost_600SemiBold",
  },

  productDetails: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 2,
  },

  productSubtotal: {
    fontSize: 14,
    marginTop: 4,
    fontFamily: "Jost_500Medium",
  },
});
