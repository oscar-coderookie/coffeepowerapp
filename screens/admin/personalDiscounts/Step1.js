import { View, Text, StyleSheet, TouchableOpacity, Platform, TextInput } from 'react-native'
import React, { useState } from 'react';
import { useTheme } from '@react-navigation/native';
import ButtonGeneral from '../../../components/ButtonGeneral';
import CustomHeader from '../../../components/CustomHeader';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../../config/firebase";
import DateTimePicker from "@react-native-community/datetimepicker"; // 👈 No olvides este

export default function Step1({ navigation, route }) {
    
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [formattedDate, setFormattedDate] = useState("");
    const [date, setDate] = useState(new Date());
    const [couponData, setCouponData] = useState({
        code: "",
        discount: "",
        description: "",
        expiresAt: "",
    });
    const { clientData } = route.params; // 👈 aquí llega el cliente desde la pantalla anterior
    const { colors } = useTheme()


    const handleChange = (key, value) => {
        setCouponData({ ...couponData, [key]: value });
    };

    const handleDateChange = (event, selectedDate) => {
        // Evita cerrar el picker automáticamente
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleConfirmDate = () => {
        const formatted = date.toISOString().split("T")[0]; // YYYY-MM-DD
        setFormattedDate(formatted);                        // 👈 guarda texto visible
        handleChange("expiresAt", formatted);               // 👈 actualiza tu form (como ya lo hacías)
        setShowDatePicker(false);
    };
    const handleApplyCoupon = async () => {
        if (!couponData.code || !couponData.discount) {
            alert("Por favor completa los campos obligatorios (código y descuento).");
            return;
        }

        try {
            // Referencia al documento del cliente
            const userRef = doc(db, "users", clientData.id); // 👈 asegúrate de tener el ID del documento
            // Si no lo tienes, te muestro abajo cómo obtenerlo

            await updateDoc(userRef, {
                coupons: arrayUnion(couponData),
            });

            alert("✅ Cupón aplicado correctamente al cliente.");
            navigation.goBack(); // opcional: volver a la pantalla anterior
        } catch (error) {
            console.error("Error al aplicar el cupón:", error);
            alert("❌ No se pudo aplicar el cupón. Intenta nuevamente.");
        }
    };

    return (
        <View>
            <CustomHeader title="2. diligencia el formulario:" showBack={true} />
            <View style={styles.block}>
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
                        placeholderTextColor={colors.text}
                        value={couponData.description}
                        onChangeText={(v) => handleChange("description", v)}
                    />
                </View>
                {/* Selector de fecha */}
                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Fecha de expiración</Text>
                    {!showDatePicker && (<TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={[
                            styles.input,
                            { justifyContent: "center", borderColor: colors.text },
                        ]}
                    >
                        <Text
                            style={{
                                color: colors.text,
                                fontFamily: "Jost_400Regular",
                            }}
                        >
                            {formattedDate ? formattedDate : "Selecciona una fecha"}
                        </Text>
                    </TouchableOpacity>)}
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            textColor={colors.text}
                            mode="date"
                            display={Platform.OS === "ios" ? "spinner" : "spinner"}
                            onChange={handleDateChange}
                            minimumDate={new Date()}
                        />

                    )}
                    {/* Botón de confirmar con icono de chulo */}
                    {showDatePicker && (<ButtonGeneral
                        textColor={colors.background}
                        bckColor={colors.text}
                        text="confirmar fecha"
                        onTouch={handleConfirmDate} />)}
                </View>

                <ButtonGeneral
                    text="Aplicar cupón"
                    textColor={colors.background}
                    bckColor={colors.text}
                    onTouch={handleApplyCoupon}
                />
            </View>
        </View>
    )
};

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
        marginHorizontal: 10
    },
    title: {
        fontFamily: 'Jost_600SemiBold',
        textTransform: 'uppercase',
        marginBottom: 10
    }
});
