import { useTheme } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";

const UserAddresses = ({ address, index }) => {
    const { colors } = useTheme();

    if (!address) return null;

    return (
        <View style={[styles.card, {borderColor:colors.border,     borderRadius: 16,}]}>
            <Text style={[styles.title, {color: colors.gold}]}>📍 Dirección de Entrega {index + 1} </Text>

            {/* BLOQUE 1 - LOCALIZACIÓN */}
            <View style={styles.blockRow}>
                <View style={styles.blockItem}>
                    <Text style={[styles.label, {color: colors.gold}]}>Comunidad</Text>
                    <Text style={[styles.value, { color: colors.text }]}>
                        {address.CA || "-"}
                    </Text>
                </View>

                <View style={styles.blockItem}>
                    <Text style={[styles.label, {color: colors.gold}]}>Provincia</Text>
                    <Text style={[styles.value, { color: colors.text }]}>
                        {address.provincia || "-"}
                    </Text>
                </View>
            </View>

            {/* BLOQUE 2 - CALLE */}
            <View style={styles.block}>
                <View style={styles.blockRow}>
                    <View style={styles.blockItem}>
                        <Text style={[styles.label, {color: colors.gold}]}>Calle, Número</Text>
                        <Text style={[styles.value, { color: colors.text }]}>
                            {address.calle}, {address.numero}
                        </Text>
                    </View>
                           <View style={styles.blockItemSmall}>
                        <Text style={[styles.label, {color: colors.gold}]}>Piso / Puerta</Text>
                        <Text style={[styles.value, { color: colors.text }]}>
                            Piso - {address.piso} / Puerta - {address.puerta || "-"}
                        </Text>
                    </View>
                </View>
                <View style={styles.block}>
                    <View style={styles.blockItem}>
                        <Text style={[styles.label, {color: colors.gold}]}>Código Postal</Text>
                        <Text style={[styles.value, { color: colors.text }]}>
                            {address.codigoPostal || "-"}
                        </Text>
                    </View>
                </View>


            </View>


            {/* BLOQUE 4 - EXTRA */}
            {address.adicional ? (
                <View style={styles.block}>
                    <Text style={styles.label}>Información adicional</Text>
                    <Text style={[styles.value, { color: colors.text }]}>
                        {address.adicional}
                    </Text>
                </View>
            ) : null}
        </View>
    );
};

export default UserAddresses;

const styles = StyleSheet.create({
    card: {
        width: "100%",
        padding: 16,
   
        marginTop: 16,
        marginVertical:10,
        borderWidth:0.5
    },
    title: {
        fontSize: 17,
        textAlign: "center",
        fontFamily: "Jost_700Bold",
        color: "#a88e19",
        marginBottom: 6,
        letterSpacing: 1,
    },
    block: {
        marginTop: 8,
    },
    blockRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 14,
        marginTop: 4,
    },
    blockItem: {
        flex: 1,
    },
    blockItemSmall: {
        flex: 1,
    },
    label: {
        fontFamily: "Jost_600SemiBold",
        fontSize: 13,
        color: "#c7b46d",
    },
    value: {
        fontFamily: "Jost_400Regular",
        fontSize: 15,
        marginTop: 2,
    },
});
