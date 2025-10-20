import { Text, TouchableOpacity } from "react-native";


const ButtonGeneral = ({onTouch, bckColor, text, textColor, marginHorizontal, disable})=>{
    return(
        <TouchableOpacity disabled={disable} onPress={onTouch} style={{backgroundColor: bckColor, padding: 20, borderRadius: 10, marginVertical:6, marginHorizontal: marginHorizontal}} >
            <Text style={{fontFamily:'Jost_700Bold', textTransform:'uppercase', textAlign:'center',color: textColor}}>{text}</Text>
        </TouchableOpacity>
    )
};

export default ButtonGeneral;