import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../../components/CustomHeader";
import OrderTimeLine from "../../components/OrderTimeLine";

export default function UserOrderDetailScreen({ route }) {
  const { colors } = useTheme();
  const { order } = route.params; // Recibes el pedido completo desde la lista

  const STATUS_MAP = {
    pending: {
      label: "En preparación",
      color: "#E53935" // rojo
    },
    tracking: {
      label: "Despachado",
      color: "#FB8C00" // naranja
    },
    delivered: {
      label: "Entregado",
      color: "#43A047" // verde
    }
  };

  const PAYMENT_STATUS_MAP = {
    succeeded: {
      label: "Pagado",
      color: "#43A047" // verde
    },
    processing: {
      label: "Pendiente",
      color: "#FB8C00" // naranja
    },
    requires_confirmation: {
      label: "Pendiente",
      color: "#FB8C00"
    },
    requires_action: {
      label: "Pendiente",
      color: "#FB8C00"
    },
    requires_payment_method: {
      label: "Rechazado",
      color: "#E53935" // rojo
    },
    canceled: {
      label: "Rechazado",
      color: "#E53935"
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title={`Detalle pedido: ${order.orderNumber}`} showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <OrderTimeLine currentStatus={order.shipmentStatus} />
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

          <Item
            label="Estado"
            value={STATUS_MAP[order.shipmentStatus]?.label}
            colors={{ ...colors, text: STATUS_MAP[order.shipmentStatus]?.color }}
          />
          <Item label="Fecha y hora" value={order.createdAt?.toDate().toLocaleString()} colors={colors} />
          <Item label="Método de pago" value={order.paymentMethod} colors={colors} />
          <Item
            label="Estado del pago"
            value={PAYMENT_STATUS_MAP[order.paymentInfo.status]?.label ?? "Desconocido"}
            colors={{
              ...colors,
              text: PAYMENT_STATUS_MAP[order.paymentInfo.status]?.color
            }}
          />
          <Item
            label="ID pago"
            value={order.paymentInfo.id}
            colors={colors}
          />
        </View>
        <View style={[styles.section, styles.box, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Datos de envío (tracking):
          </Text>
          <Item
            label="Empresa de envío"
            value={order.courier}
            colors={colors}
          />
          <Item
            label="#Tracking"
            value={order.courier}
            colors={colors}
          />
          <Item
            label="Entregado el"
            value={order.shippedAt}
            colors={colors}
          />
          <Item label="Método de envío" value={`${order.shippingMethod}(de 3-5 días hábiles)`} colors={colors} />
        </View>

        {/* Dirección de envío */}
        {order.shippingAddress && (
          <View style={[styles.section, styles.box, { backgroundColor: colors.card }]}>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Dirección de envío y móvil:
            </Text>

            {/* Línea completa de dirección */}
            <Item
              label="Dirección"
              value={
                order.shippingAddress
                  ? [
                    order.shippingAddress.calle,
                    order.shippingAddress.numero && `#${order.shippingAddress.numero}`,
                    order.shippingAddress.piso && `Piso ${order.shippingAddress.piso}`,
                    order.shippingAddress.puerta && `Puerta ${order.shippingAddress.puerta}`
                  ]
                    .filter(Boolean)
                    .join(", ")
                  : "No disponible"
              }
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
              label="CP"
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
                label="Móvil"
                value={`+${order.phone.codigo} ${order.phone.numero}`}
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

          {order.items?.map((item, idx) => (
            <View key={idx} style={styles.productItem}>
              <Text style={[styles.productName, { color: colors.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.productDetails, { color: colors.text }]}>
                Cantidad: {item.quantity ?? "—"}  •  Precio: €
                {item.price ? item.price.toFixed(2) : "0.00"}
              </Text>

              <Text style={[styles.productSubtotal, { color: colors.text , borderTopColor: colors.text}]}>
                Subtotal: €
                {item.subtotal ? item.subtotal.toFixed(2) : "0.00"}
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
          <Item label="Descuento" value={`Cupón: ${order.appliedCoupon.code} (${order.appliedCoupon.discount}%) - € ${order.discountAmount?.toFixed(2)}`} colors={colors} />
          <Item label="Envío" value={`+ € ${order.shippingCost?.toFixed(2)}`} colors={colors} />
          <Item
            label="Total pagado"
            value={`€ ${order.paymentInfo.amount?.toFixed(2)}`}
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
    width: '100%'
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

  productName: {
    fontSize: 15,
    fontFamily: "Jost_600SemiBold",
  },

  productDetails: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 2,
    marginBottom: 10,

  },

  productSubtotal: {
    fontSize: 14,
    borderTopWidth: 1,
    paddingTop: 10,
    fontFamily: "Jost_500Medium",
  },
});
