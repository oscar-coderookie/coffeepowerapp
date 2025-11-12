import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import { useTheme } from '@react-navigation/native'
import { TextInput } from 'react-native-gesture-handler'
import { useState } from 'react'
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config/firebase'
import DateTimePicker from "@react-native-community/datetimepicker";
import ButtonGeneral from '../../../components/ButtonGeneral'

export default function PersonalDiscounts({ navigation }) {
  const [clientEmail, setClientEmail] = useState("")
  const [clientData, setClientData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { colors } = useTheme()

  // Campos del cupón

  const handleInputMail = (text) => {
    const cleaned = text.trim(); // opcional: recortar espacios
    setClientEmail(cleaned);
  }

  const searchClientByEmail = async () => {
    if (!clientEmail) {
      alert("Por favor introduce un correo primero.");
      return;
    }

    try {
      const usersRef = collection(db, "users"); // <-- cambia "users" si tu colección se llama distinto
      const q = query(usersRef, where("email", "==", clientEmail.trim().toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setClientData(null);
        setErrorMessage("Error: No se encontró ningún cliente registrado con ese correo.");
        return;
      }

      // Si hay coincidencias, toma el primero (o todos)
      const userDoc = querySnapshot.docs[0];
      const userData = { id: userDoc.id, ...userDoc.data() };
      setClientData(userData);
    } catch (error) {
      setErrorMessage(error)

    }
  };



  return (
    <View>
      <CustomHeader title="búsqueda de cliente:" showBack={true} />
      <ScrollView contentContainerStyle={styles.main} >
        <Text style={[styles.text, { color: colors.text }]} >En esta sección podreís crear un cupón de descuento personalizado, filtrando vuestro cliente por correo electrónico registrado y aplicándole un cupón de descuento personalizado a sus necesidades:</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>1. Busca el cliente al cual queréis aplicarle el descuento introduciendo su dirección de correo registrada en la app:</Text>
        <TextInput placeholderTextColor={colors.text} onChangeText={handleInputMail} value={clientEmail} style={[styles.input, { outlineColor: colors.text, color: colors.text }]} placeholder='introduce aquí la direccion de correo' />
        <ButtonGeneral
          text="buscar cliente"
          textColor="white"
          bckColor={["#000000ff", "#535353ff", "#000000ff", "#6b6b6bff", "#000000ff"]}
          borderColors={["#535353ff", "#000000ff", "#535353ff", "#000000ff", "#535353ff"]}
          onTouch={searchClientByEmail}
          soundType="click"

        />

        {clientData && (
          <>
            <Text style={[styles.subtitle, { color: colors.text }]}>Cliente Encontrado:</Text>
            <View style={[styles.resultBox, { borderColor: colors.text }]}>
              <View>
                <Text style={[styles.resultText, { color: colors.text }]}>Nombre: {clientData.name}</Text>
                <Text style={[styles.resultText, { color: colors.text }]}>Móvil: +{clientData.phone.codigo} {clientData.phone.numero}</Text>
                <Text style={[styles.resultText, { color: colors.text }]}>Correo: {clientData.email}</Text>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Image resizeMode='cover' source={{ uri: clientData.avatar }} style={{ width: 60, height: 60, borderRadius: 60 }} />
              </View>
            </View>
            <ButtonGeneral
              text="aplicar descuento"
              textColor="white"
              bckColor={["#000000ff", "#535353ff", "#000000ff", "#6b6b6bff", "#000000ff"]}
              borderColors={["#535353ff", "#000000ff", "#535353ff", "#000000ff", "#535353ff"]}
              onTouch={() => navigation.navigate("Descuentos Personales2", { clientData })}
              soundType="click" />
          </>

        )}
        {/* Mensaje de error */}
        {!clientData && errorMessage !== "" && (
          <Text style={{ color: "red", textAlign: "center", fontFamily: 'Jost_400Regular', fontSize: 11 }}>{errorMessage}</Text>
        )}
      </ScrollView>

    </View>
  )
};

const styles = StyleSheet.create({
  main: {
    marginHorizontal: 10,
    paddingBottom: 40,
    paddingTop:20
  },
  text: {
    fontFamily: 'Jost_400Regular',
    textAlign: 'justify'
  },
  subtitle: {
    fontFamily: 'Jost_700Bold',
    textAlign: 'justify',
    marginVertical: 10
  },
  input: {
    outlineWidth: 1,
    padding: 10,
    borderRadius: 10,
    fontFamily: 'Jost_400Regular'
  },
  resultBox: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    justifyContent: 'space-between'

  },
  resultText: {
    fontFamily: 'Jost_400Regular',
    marginBottom: 5,

  },
  label: {
    fontFamily: "Jost_600SemiBold",
    marginBottom: 5,
    fontSize: 15,
  },
  formGroup: { marginBottom: 18 },
  block: {
    paddingBottom: 60
  }
})