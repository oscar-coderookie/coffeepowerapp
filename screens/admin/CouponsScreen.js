import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, getDocs, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../../components/CustomHeader";
import ButtonGeneral from "../../components/ButtonGeneral";
import LoadingScreen from "../../components/LoadingScreen";

export default function InjectCouponsScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  // Campos del cupón
  const [couponData, setCouponData] = useState({
    code: "",
    discount: "",
    description: "",
    expiresAt: "",
  });

  const handleChange = (key, value) => {
    setCouponData({ ...couponData, [key]: value });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD
      handleChange("expiresAt", formattedDate);
    }
  };

  const handleSubmit = async () => {
    const { code, discount, description, expiresAt } = couponData;

    if (!code || !discount) {
      Alert.alert("Campos requeridos", "Debes llenar al menos el código y el descuento.");
      return;
    }

    Alert.alert(
      "Confirmar inyección",
      "¿Seguro que deseas aplicar este cupón a todos los usuarios registrados?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, aplicar",
          onPress: async () => {
            console.log("✅ Confirmación aceptada. Iniciando proceso de inyección...");
            setLoading(true);
            try {
              const usersRef = collection(db, "users");
              console.log("Buscando usuarios...");
              const snapshot = await getDocs(usersRef);
              console.log("Usuarios encontrados:", snapshot.size);
              if (snapshot.empty) {
                Alert.alert("Sin usuarios", "No se encontraron usuarios en la base de datos.");
                return;
              }

              let successCount = 0;

              const promises = snapshot.docs.map(async (userDoc) => {
                const userRef = doc(db, "users", userDoc.id);
                await updateDoc(userRef, {
                  coupons: arrayUnion({
                    code: code.trim().toUpperCase(),
                    discount: parseFloat(discount),
                    description: description.trim(),
                    expiresAt,
                    createdAt: new Date().toISOString(),
                    used: false,
                  }),
                });
                successCount++;
              });

              await Promise.all(promises);

              Alert.alert(
                "✅ Proceso completado",
                `Cupón "${code.toUpperCase()}" inyectado a ${successCount} usuarios.`
              );

              setCouponData({
                code: "",
                discount: "",
                description: "",
                expiresAt: "",
              });
            } catch (error) {
              console.error("Error inyectando cupones:", error);
              Alert.alert("Error", "Ocurrió un problema al inyectar los cupones.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) return <LoadingScreen message="Inyectando cupones..." />;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Inyectar Cupones" showBack={true} />

      <Text style={[styles.subtitle, { color: colors.text }]}>
        Crea un cupón y aplícalo automáticamente a todos los usuarios registrados.
      </Text>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Código del cupón *</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.text }]}
          placeholder="Ej: BIENVENIDO10"
          placeholderTextColor={colors.text + "88"}
          value={couponData.code}
          onChangeText={(v) => handleChange("code", v)}
          autoCapitalize="characters"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Descuento (%) *</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.text }]}
          placeholder="Ej: 10"
          placeholderTextColor={colors.text + "88"}
          keyboardType="numeric"
          value={couponData.discount}
          onChangeText={(v) => handleChange("discount", v)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Descripción</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.text }]}
          placeholder="Ej: Descuento de bienvenida"
          placeholderTextColor={colors.text + "88"}
          value={couponData.description}
          onChangeText={(v) => handleChange("description", v)}
        />
      </View>

      {/* Selector de fecha */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Fecha de expiración</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[
            styles.input,
            { justifyContent: "center", borderColor: colors.text },
          ]}
        >
          <Text
            style={{
              color: couponData.expiresAt ? colors.text : colors.text + "88",
              fontFamily: "Jost_400Regular",
            }}
          >
            {couponData.expiresAt || "Selecciona una fecha"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      <ButtonGeneral
        text="Inyectar a todos los usuarios"
        textColor={colors.background}
        bckColor={colors.text}
        onTouch={handleSubmit}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  subtitle: {
    fontSize: 16,
    fontFamily: "Jost_400Regular",
    textAlign: "center",
    marginBottom: 25,
    marginTop: 10,
  },
  formGroup: { marginBottom: 18 },
  label: {
    fontFamily: "Jost_600SemiBold",
    marginBottom: 5,
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontFamily: "Jost_400Regular",
  },
});
