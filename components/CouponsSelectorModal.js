// components/CouponSelectorModal.js
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";

export default function CouponSelectorModal({ visible, onClose, coupons, onSelect, colors }) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.text }]}>Selecciona un cupón</Text>

          {coupons.length === 0 ? (
            <Text style={[styles.noCoupons, { color: colors.text }]}>
              No tienes cupones disponibles 😔
            </Text>
          ) : (
            <FlatList
              data={coupons}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.couponItem, { borderColor: colors.text }]}
                  onPress={() => onSelect(item)}
                >
                  <View>
                    <Text style={[styles.couponCode, { color: colors.text }]}>{item.code}</Text>
                    <Text style={[styles.couponDesc, { color: colors.text }]}>
                      {item.discount}% de descuento
                    </Text>
                    {item.expiresAt && (
                      <Text style={[styles.couponDate, { color: colors.text }]}>
                        Válido hasta: {new Date(item.expiresAt).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
          )}

          <TouchableOpacity style={[styles.closeBtn, { backgroundColor: colors.text }]} onPress={onClose}>
            <Text style={[styles.closeText, { color: colors.background }]}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    borderRadius: 15,
    padding: 20,
    maxHeight: "70%",
  },
  title: {
    fontFamily: "Jost_600SemiBold",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 15,
  },
  couponItem: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
  },
  couponCode: {
    fontFamily: "Jost_600SemiBold",
    fontSize: 16,
    textTransform: "uppercase",
  },
  couponDesc: {
    fontFamily: "Jost_400Regular",
    fontSize: 14,
  },
  couponDate: {
    fontFamily: "Jost_300Light",
    fontSize: 12,
    marginTop: 3,
  },
  noCoupons: {
    fontFamily: "Jost_400Regular",
    textAlign: "center",
    marginVertical: 20,
  },
  closeBtn: {
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  closeText: {
    fontFamily: "Jost_600SemiBold",
    fontSize: 16,
  },
});
