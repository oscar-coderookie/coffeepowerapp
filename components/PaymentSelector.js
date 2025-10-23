import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

export default function PaymentSelector({ selectedMethod, onSelect }) {
  const { colors } = useTheme();

  const methods = [
    {
      id: "bizum",
      label: "Bizum",
      logo: require("../assets/icons/bizum-logo.png"), // 🟢 Asegúrate de tener este logo
    },
    { 
      id: "visa",
      label: "Tarjeta Visa",
      logo: require("../assets/icons/visa.png"),
    },
    {
      id: "mastercard",
      label: "Tarjeta Mastercard",
      logo: require("../assets/icons/mastercard.png"),
    },
    {
      id: "amex",
      label: "American Express",
      logo: require("../assets/icons/amexpress.png"),
    },
    {
      id: "gpay",
      label: "Google Pay",
      logo: require("../assets/icons/gpay.png"),
    },
    {
      id: "applepay",
      label: "Apple Pay",
      logo: require("../assets/icons/applepay.png"),
    },
    {
      id: "sepa",
      label: "Transferencia SEPA",
      logo: require("../assets/icons/sepa.png"),
    },
     
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Selecciona un método de pago:</Text>

      {methods.map((method) => {
        const isSelected = selectedMethod === method.id;
        return (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodBtn,
              {
                backgroundColor: isSelected ? "#8a6d0dff" : colors.card,
                borderColor: isSelected ? "#8a6d0dff" : colors.border,
              },
            ]}
            onPress={() => onSelect(method.id)}
            activeOpacity={0.8}
          >
            <View style={styles.row}>
              <Image
                source={method.logo}
                style={[styles.logo, { tintColor: isSelected ? colors.background : colors.text }]}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.label,
                  {
                    color: isSelected ? colors.background : colors.text,
                  },
                ]}
              >
                {method.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {

  },
  title: {
    fontSize: 18,
    fontFamily: "Jost_600SemiBold",
    marginBottom: 10,
  },
  methodBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    padding: 8,
    marginVertical: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  label: {
    fontFamily: "Jost_500Medium",
    fontSize: 16,
  },
});
