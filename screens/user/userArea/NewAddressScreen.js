import React, { useState } from "react";
import { View, Text } from "react-native";
import { auth, db } from "../../../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import AddressBlock from "../../../components/AddressBlock";
import CustomHeader from "../../../components/CustomHeader";
import { ScrollView } from "moti";

export default function NewAddressScreen({ navigation }) {
    return (
        <View>
            <CustomHeader title="Crear Dirección" showBack />
            <ScrollView contentContainerStyle={{ padding: 10 }}>
                <AddressBlock
                    addressId={null}
                    initialData={{}}     // ← NO LE PASES tempAddress si es nueva
                    onClose={() => navigation.goBack()}   // ← Cuando se guarde, cierras
                />

                {/* Puedes reemplazar el botón de AddressBlock por uno aquí si quieres */}
            </ScrollView>
        </View>

    );
}
