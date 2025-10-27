import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import CustomHeader from '../../components/CustomHeader'
import { useTheme } from '@react-navigation/native'
import ButtonGeneral from '../../components/ButtonGeneral'

export default function MainDiscounts({ navigation }) {
  const { colors } = useTheme()
  return (
    <View style={styles.main}>
      <CustomHeader title="descuentos" />
      <View style={{ marginHorizontal: 10 }}>
        <Text style={[styles.text, { color: colors.text }]}>
          En esta pantalla podrás gestionar todo lo relacionado con los cupones y campañas de descuento que le enviaís a vuestros clientes:
        </Text>
        <ButtonGeneral text="Crear descuento masivo" bckColor={colors.text} textColor={colors.background} onTouch={()=> navigation.navigate("Descuentos Masivos")}/>
        <ButtonGeneral text="Crear descuento Personal" bckColor={colors.text} textColor={colors.background} onTouch={()=> navigation.navigate("Descuentos Personales")}/>
      </View>

    </View>
  )
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  text: {
    fontFamily: 'Jost_400Regular',
    textAlign: 'justify'
  }
})