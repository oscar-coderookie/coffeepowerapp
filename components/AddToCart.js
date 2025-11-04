import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native'
import React, { useContext, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../context/CartContext';
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from '@react-navigation/native';
import { playSound } from '../utils/soundPlayer';


export default function AddToCart({ coffee }) {
    const { addToCart } = useContext(CartContext);
    const [quantity, setQuantity] = useState(1);
    const { colors } = useTheme();

    const handleAddToCart = () => {
        
        addToCart({ ...coffee, quantity });
        playSound("cart")
        Alert.alert(
            "Añadido al carrito",
            `${quantity} x ${coffee.name} se agregó a tu carrito`
        );
    };
    const increaseQuantity = () => setQuantity((prev) => prev + 1);
    const decreaseQuantity = () =>
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    return (
        <View style={styles.generalContainer}>
            <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={decreaseQuantity}>
                    <LinearGradient
                        colors={["#705e2fff", "#ffe194ff", "#705e2fff"]} // dorado metálico
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.qtyButton} >
                        <Ionicons name="remove" size={26} color="black" />
                    </LinearGradient>

                </TouchableOpacity>

                <TextInput
                    style={styles.qtyInput}
                    value={quantity.toString()}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                        const num = parseInt(text) || 1;
                        setQuantity(num > 0 ? num : 1);
                    }}
                />

                <TouchableOpacity onPress={increaseQuantity}>
                    <LinearGradient
                        colors={["#705e2fff", "#ffe194ff", "#705e2fff"]} // dorado metálico
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.qtyButton} >
                        <Ionicons name="add" size={26} color="black" />
                    </LinearGradient>

                </TouchableOpacity>
            </View>

            {/* 🛒 Botón de añadir */}
            <TouchableOpacity onPress={handleAddToCart}>
                <LinearGradient
                    colors={["#705e2fff", "#ffe194ff", "#705e2fff"]} // dorado metálico
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.cartButton,]} >

                    <Ionicons name="cart" size={24} color="black" style={{ marginRight: 8 }} />
                    <Text style={[styles.cartButtonText, { color: 'black' }]}>Añadir</Text>
                </LinearGradient>

            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',

    },
    qtyButton: {
        padding: 12,
        backgroundColor: "#a88e19ff",
        borderRadius: 10,
        alignItems: 'center',
    },
    qtyInput: {
        marginHorizontal: 6,
        backgroundColor: "#fff",
        color: "#000",
        borderRadius: 10,
        textAlign: "center",
        fontFamily: "Jost_700Bold",
        fontSize: 20,
        height: '100%',
        paddingHorizontal: 10
    },
    cartButton: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: "#a88e19ff",
        padding: 16,
        borderRadius: 10,
        marginTop: 6,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    cartButtonText: {
        fontSize: 16,
        fontFamily: "Jost_600SemiBold",
        textTransform: 'uppercase',
        textAlign: 'center'
    },


})