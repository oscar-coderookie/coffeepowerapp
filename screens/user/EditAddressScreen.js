import { useUser } from "../../context/UserContext";
import AddressBlock from "../../components/AddressBlock";
import { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, Modal } from "react-native";
import CustomHeader from "../../components/CustomHeader";
import { ScrollView } from "moti";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import ReactNativeModal from "react-native-modal";

export default function EditAddressScreen() {
  const { addresses, fetchAddresses } = useUser();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const openEditor = (addr) => {
    setSelectedAddress(addr);
    setModalVisible(true);
  };

  const closeEditor = () => {
    setModalVisible(false);
    setSelectedAddress(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="Editar Dirección" showBack />
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        <Text style={{ fontFamily: 'Jost_400Regular', marginBottom: 6 }}>Selecciona la dirección que quieres editar:</Text>
        {addresses.map(addr => (
          <TouchableOpacity
            key={addr.id}
            style={{

              borderWidth: 1,
              borderColor: colors.text,
              padding: 14,
              borderRadius: 12,
              marginBottom: 12
            }}
            onPress={() => openEditor(addr)}
          >
            {/* Linea 1: Calle + número + piso/puerta */}
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 4 }}>
              {addr.calle} {addr.numero}
              {addr.piso || addr.puerta
                ? `, ${addr.piso ? addr.piso + "º Piso" : ""}, Puerta ${addr.puerta ? addr.puerta : ""}`
                : ""}
            </Text>

            {/* Linea 2: CP + provincia */}
            <Text style={{ opacity: 0.9 }}>
              {addr.codigoPostal} – {addr.provincia}
            </Text>

            {/* Linea 3: Comunidad Autónoma */}
            <Text style={{ opacity: 0.7, fontSize: 13 }}>
              {addr.CA}
            </Text>

            {/* Referencia (solo si existe) */}
            {addr.referencia ? (
              <Text style={{ marginTop: 6, opacity: 0.7, fontSize: 13 }}>
                Ref: {addr.referencia}
              </Text>
            ) : null}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* MODAL DEL EDITOR */}

      <ReactNativeModal
        isVisible={modalVisible}
        onSwipeComplete={closeEditor}
        swipeDirection="down"
        backdropOpacity={0.4}   // Fondo oscuro suave
        style={{ margin: 0 }}   // Ocupa toda la pantalla
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 12,
          }}
        >
          {/* Handler visual para arrastrar */}
          <View
            style={{
              width: 45,
              height: 5,
              backgroundColor: "#ccc",
              borderRadius: 5,
              alignSelf: "center",
              marginBottom: 12,
            }}
          />

          <AddressBlock
            addressId={selectedAddress?.id}
            initialData={selectedAddress}
            onClose={closeEditor}
          />
        </View>
      </ReactNativeModal>




    </View>
  );
}
