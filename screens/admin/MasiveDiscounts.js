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
import { collection, getDocs, updateDoc, doc, arrayUnion, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../../components/CustomHeader";
import ButtonGeneral from "../../components/ButtonGeneral";
import LoadingScreen from "../../components/LoadingScreen";
import Toast from "react-native-toast-message";

export default function InjectCouponsScreen() {
  const { colors } = useTheme();

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [date, setDate] = useState(new Date());

  // CAMPOS DEL CUPÓN + NUEVOS CAMPOS DEL MENSAJE
  const [couponData, setCouponData] = useState({
    code: "",
    discount: "",
    description: "",
    expiresAt: "",
    messageTitle: "",
    messageBody: "",
  });

  const handleChange = (key, value) => {
    setCouponData({ ...couponData, [key]: value });
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) setDate(selectedDate);
  };

  const handleConfirmDate = () => {
    const formatted = date.toISOString().split("T")[0];
    setFormattedDate(formatted);
    handleChange("expiresAt", formatted);
    setShowDatePicker(false);
  };

  const handleSubmit = async () => {
    const { code, discount, description, expiresAt, messageTitle, messageBody } = couponData;

    if (!code || !discount || !messageTitle.trim() || !messageBody.trim()) {
      Toast.show({
        type: "error",
        text1: "Campos incompletos",
        text2: "Debes llenar código, descuento, título y cuerpo del mensaje.",
      });
      return;
    }

    Alert.alert(
      "Confirmar inyección",
      "¿Deseas aplicar este cupón y enviar un mensaje a todos los usuarios?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, aplicar",
          onPress: async () => {
            Toast.show({
              type: "working",
              text1: "Ejecutando",
              text2: "Iniciando proceso de inyección...",
            });

            setLoading(true);
            try {
              const usersRef = collection(db, "users");
              const snapshot = await getDocs(usersRef);

              if (snapshot.empty) {
                Toast.show({
                  type: "error",
                  text1: "Sin usuarios",
                  text2: "No existen usuarios registrados.",
                });
                return;
              }

              let successCount = 0;

              const promises = snapshot.docs.map(async (userDoc) => {
                const userRef = doc(db, "users", userDoc.id);

                // 1️⃣ Inyectar cupón
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

                // 2️⃣ Crear mensaje
                const messageRef = doc(collection(db, `users/${userDoc.id}/messages`));
                await setDoc(messageRef, {
                  id: messageRef.id,
                  title: messageTitle.trim(),
                  body: messageBody.trim(),
                  couponCode: code.trim().toUpperCase(),
                  discount: parseFloat(discount),
                  expiresAt: expiresAt,
                  read: false,
                  createdAt: new Date().toISOString(),
                  type: "coupon",
                });

                successCount++;
              });

              await Promise.all(promises);

              Toast.show({
                type: "success",
                text1: "Proceso completado",
                text2: `Cupón y mensaje enviados a ${successCount} usuarios.`,
              });

              // RESET
              setCouponData({
                code: "",
                discount: "",
                description: "",
                expiresAt: "",
                messageTitle: "",
                messageBody: "",
              });
              setFormattedDate("");

            } catch (error) {
              console.error(error);
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "Ocurrió un problema en la inyección.",
              });
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
      <CustomHeader title="Crear descuento masivo:" showBack={true} />

      <View style={styles.block}>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Crea un cupón y aplícalo automáticamente a todos los usuarios.
        </Text>

        <Text style={styles.title}>Formulario de Creación de descuento:</Text>

        {/* CÓDIGO */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Código *</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.text }]}
            placeholder="Ej: BIENVENIDO10"
            placeholderTextColor={colors.text}
            value={couponData.code}
            onChangeText={(v) => handleChange("code", v)}
            autoCapitalize="characters"
          />
        </View>

        {/* DESCUENTO */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Descuento (%) *</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.text }]}
            placeholder="Ej: 10"
            placeholderTextColor={colors.text}
            keyboardType="numeric"
            value={couponData.discount}
            onChangeText={(v) => handleChange("discount", v)}
          />
        </View>

        {/* DESCRIPCIÓN */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Descripción</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.text }]}
            placeholder="Ej: Descuento de bienvenida"
            placeholderTextColor={colors.text}
            value={couponData.description}
            onChangeText={(v) => handleChange("description", v)}
          />
        </View>

        {/* TÍTULO DEL MENSAJE */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Título del mensaje *</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.text }]}
            placeholder="Ej: ¡Tienes un nuevo cupón!"
            placeholderTextColor={colors.text}
            value={couponData.messageTitle}
            onChangeText={(v) => handleChange("messageTitle", v)}
          />
        </View>

        {/* BODY DEL MENSAJE */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Mensaje *</Text>
          <TextInput
            style={[styles.input, { height: 100, color: colors.text, borderColor: colors.text }]}
   
            placeholderTextColor={colors.text}
            multiline
            value={couponData.messageBody}
            onChangeText={(v) => handleChange("messageBody", v)}
          />
        </View>

        {/* FECHA */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Fecha de expiración</Text>

          {!showDatePicker && (
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={[styles.input, { justifyContent: "center", borderColor: colors.text }]}
            >
              <Text style={{ color: colors.text, fontFamily: "Jost_400Regular" }}>
                {formattedDate || "Selecciona una fecha"}
              </Text>
            </TouchableOpacity>
          )}

          {showDatePicker && (
            <>
              <DateTimePicker
                value={date}
                textColor={colors.text}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "spinner"}
                onChange={handleDateChange}
                minimumDate={new Date()}
              />

              <ButtonGeneral
                textColor={colors.background}
                bckColor={colors.text}
                text="confirmar fecha"
                onTouch={handleConfirmDate}
              />
            </>
          )}
        </View>

        {/* BOTÓN FINAL */}
        <ButtonGeneral
          text="Aplicar cupón a todos los usuarios"
          textColor="white"
          bckColor={["#000000ff", "#535353ff", "#000000ff", "#6b6b6bff", "#000000ff"]}
          borderColors={["#535353ff", "#000000ff", "#535353ff", "#000000ff", "#535353ff"]}
          onTouch={handleSubmit}
          soundType="click"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  subtitle: {
    fontFamily: "Jost_400Regular",
    textAlign: "justify",
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
  block: {
    marginHorizontal: 10,
  },
  title: {
    fontFamily: "Jost_600SemiBold",
    textTransform: "uppercase",
    marginBottom: 10,
  },
});
