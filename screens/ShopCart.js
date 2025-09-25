import { StyleSheet, Text, View } from "react-native"
import CartScreen from "./CartScreen";

const CarShop = ()=>{
    return(
        <View style={styles.container}>
            <CartScreen/>
        </View>
    )
};

export default CarShop;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems:'center',
        justifyContent:'center'
    },
    text:{
        color:'#fff'
    }
})