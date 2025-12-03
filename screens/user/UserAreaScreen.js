import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, View, Text, ScrollView, StyleSheet, FlatList } from "react-native";
import { useTheme } from "@react-navigation/native";
import AvatarPicker from "../../components/AvatarPicker";
import ButtonGeneral from "../../components/ButtonGeneral";
import VerifyEmailBlock from "../../components/VerifyEmail";
import { MotiView } from "moti"; // 👈 Importamos MotiView
import { playSound } from "../../utils/soundPlayer";
import { useUser } from "../../context/UserContext";
import UserAddresses from "./userArea/UserAddresses";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { usePayments } from "../../context/PaymentsContext";

export default function UserAreaScreen({ navigation }) {
  const { userData, addresses } = useUser();
  const [avatar, setAvatar] = useState(null);
  const { colors } = useTheme();
  const { paymentMethods } = usePayments()

  // 🔹 Cargar métodos de pago del usuario al montar


  return (
    <View style={styles.container}>
      <VerifyEmailBlock />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView>

          {/* 🌀 Animación de entrada para avatar y nombre */}
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600 }}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "space-around",
              flexDirection: "row",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <AvatarPicker size={100} initialAvatar={avatar} onAvatarChange={setAvatar} />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontFamily: "Jost_600SemiBold", textTransform: "uppercase", width: "100%", color: colors.text }}>
                Bienvenido:
              </Text>
              <Text style={{ textTransform: "capitalize", fontFamily: "Jost_400Regular", color: colors.text }}>
                {userData?.name ?? "Usuario"}
              </Text>
            </View>
          </MotiView>

          {/* 🧱 Secciones animadas al hacer scroll */}

          <Text style={[styles.title, { backgroundColor: colors.text, color: colors.background }]}>
            Correo registrado:
          </Text>
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 800, delay: 200 }}
            style={[styles.infoContainer, { marginVertical: 20, alignItems: 'center' }]}
          >

            <Text style={{ fontFamily: "Jost_600SemiBold", color: colors.text }}>
              {userData?.email ?? "No definido"}
            </Text>
          </MotiView>
          <Text style={[styles.title, { backgroundColor: colors.text, color: colors.background }]}>
            Direcciones registradas:
          </Text>
          <View style={styles.field}>
            {addresses.map((item, index) => (
              <MotiView
                key={item.id}
                from={{ opacity: 0, translateY: 15 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 1200, delay: 400 }}
              >
                <UserAddresses address={item} index={index} key={index} />
              </MotiView>
            ))}

          </View>
          <Text style={[styles.title, { backgroundColor: colors.text, color: colors.background }]}>
            <FontAwesome name="whatsapp" size={24} color={colors.background} /> Whatsapp Personal:
          </Text>

          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 800, delay: 200 }}
            style={[styles.infoContainer, { flexDirection: 'row', justifyContent: 'center', marginVertical: 20 }]}
          >
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.subtitle, { color: colors.text }]}>
                Código:
              </Text>
              <Text style={[styles.text, { color: colors.text, marginLeft: 10 }]}>
                +{userData?.phone?.codigo ?? "000"}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', marginLeft: 20 }}>
              <Text style={[styles.subtitle, { color: colors.text }]}>
                Número:
              </Text>
              <Text style={[styles.text, { color: colors.text, marginLeft: 10 }]}>
                {userData?.phone?.numero ?? "000000000"}
              </Text>
            </View>
          </MotiView>



          <Text style={[styles.title, { backgroundColor: colors.text, color: colors.background }]}>
            Métodos de pago:
          </Text>

          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 1200, delay: 500 }}
            style={styles.paymentMethods}
          >
          </MotiView>
          {paymentMethods.length > 0 && (
            <View style={{ marginTop: 20, marginHorizontal: 10 }}>
              <FlatList
                data={paymentMethods}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={{flexDirection:'row', alignItems:'center', borderRadius: 20, borderColor: colors.text, borderWidth:0.5, padding: 10, justifyContent:'space-between'}} >
                    <FontAwesome5
                      name={
                        item.card.brand === "visa"
                          ? "cc-visa"
                          : item.card.brand === "mastercard"
                            ? "cc-mastercard"
                            : item.card.brand === "amex"
                              ? "cc-amex"
                              : "cc-credit-card"

                      }
                      size={40}
                      color={colors.text}
                      style={{marginLeft:20}}

                    />
                    <Text style={[styles.text, {color: colors.text, marginLeft: 10, fontFamily: 'Jost_600SemiBold'}]}>
                     Terminada en: {item.card.last4}{" "}
                    </Text>
                  </View>
                )}

              />
            </View>
          )}
        </ScrollView>

        <ButtonGeneral
          bckColor={["#000000ff", "#535353ff", "#000000ff", "#6b6b6bff", "#000000ff"]}
          text="Ir a tu carrito"
          textColor="white"
          onTouch={() => {
            playSound("click"); // 🎵 reproduce el sonido
            const rootNavigation = navigation.getParent()?.getParent();
            rootNavigation?.navigate("CartScreen");
          }}
          marginHorizontal={10}
          borderColors={["#535353ff", "#000000ff", "#535353ff", "#000000ff", "#535353ff"]}
          soundType="click"

        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-start", paddingBottom: 20 },
  title: {
    fontSize: 18,
    textTransform: "uppercase",
    textAlign: "center",
    fontFamily: "Jost_700Bold",
    padding: 10,
    justifyContent: 'center'
  },
  subtitle: {
    fontFamily: 'Jost_600SemiBold'
  },
  text: {
    textAlign: "center",
    fontFamily: "Jost_400Regular",
  },
  infoContainer: { marginHorizontal: 10, marginVertical: 10, },
  field: {



    marginHorizontal: 10
  },
  paymentMethods: {
    justifyContent: "center",
  },
});
