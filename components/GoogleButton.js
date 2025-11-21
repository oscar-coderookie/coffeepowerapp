import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { TouchableOpacity, Text, Image, StyleSheet } from "react-native";

export default function GoogleButton({ onPress }) {

    const { colors } = useTheme();
    
    return (
        <TouchableOpacity style={[styles.button, {backgroundColor:colors.text}]} onPress={onPress}>
            <Ionicons size={30} color={colors.background} name="logo-google" />
            <Text style={[styles.text,{color:colors.background}]}>Login con Google</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        justifyContent:'center',
        marginTop: 10,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 35,
        alignItems: "center",
        width: "100%",
        borderWidth: 1,
        borderColor: "#ddd",
    },
    text: {
        fontSize: 16,
        textTransform:'uppercase',
        marginLeft:10,
        width:'55%',
        fontFamily:'Jost_700Bold'
    }
});
