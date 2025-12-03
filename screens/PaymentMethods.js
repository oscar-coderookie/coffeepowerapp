import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../components/CustomHeader";
import { LinearGradient } from 'expo-linear-gradient';
import { usePayments } from "../context/PaymentsContext";



const PaymentMethods = () => {
  const { paymentMethods, handleRemoveMethod, handleAddPaymentMethod } = usePayments();
  const { colors } = useTheme();

  const renderCardItem = ({ item }) => (

    <LinearGradient
      colors={['#e4c86dff', '#998030ff', '#e4c86dff', '#998030ff']} // Tonos dorados
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.cardItem, {
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        height: 200
      }]}
    >
      <View style={styles.infoCard}>
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

        />
        <Text style={[styles.cardText]}>
          **** **** **** {item.card.last4}{" "}

        </Text>
      </View>
      <View style={{flexDirection:'row'}}>
            <Text style={[styles.cardText]}>VALID: {item.card.exp_month} / {item.card.exp_year}</Text>
            <Text style={[styles.cardText]}>VALID: {item.card.exp_month} / {item.card.exp_year}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleRemoveMethod(item.id)}
        style={{ padding: 10, backgroundColor: '#3131316b', borderRadius: 22 }}
      >
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </LinearGradient>
  );



  return (
    <View style={styles.container}>
      <CustomHeader title="métodos de pago" showBack />
      <View >
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Aquí puedes añadir y modificar tus métodos de pago:
        </Text>

        <View style={{ marginHorizontal: 10 }}>
          {/* 🔹 Lista de métodos de pago existentes */}
          {paymentMethods.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={[styles.subtitle, { color: colors.text }]}>Tus Tarjetas:</Text>
              <FlatList
                data={paymentMethods}
                keyExtractor={(item) => item.id}
                renderItem={renderCardItem}
                scrollEnabled={false}
              />
            </View>
          )}
          <TouchableOpacity
            style={[styles.gpayButton, { backgroundColor: colors.text }]}
            onPress={handleAddPaymentMethod}
          >
            <Text style={{ color: colors.background, fontSize: 26, marginRight: 10 }}>+</Text>
            <FontAwesome5 name="credit-card" size={30} color={colors.background} />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, marginBottom: 20 },
  subtitle: { fontFamily: "Jost_400Regular", marginVertical: 16, textAlign: "center" },
  gpayButton: {

    borderRadius: 10,
    justifyContent: "center",
    paddingVertical: 12,
    marginVertical: 6,
    alignItems: "center",
    flexDirection: "row",
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '90%'
  },
  cardItem: {
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#997528ff",
    padding: 12,
    height: 100,
    borderRadius: 8,
    marginVertical: 4,
  },
  cardText: {  fontFamily: "Jost_400Regular" },
});

export default PaymentMethods;
