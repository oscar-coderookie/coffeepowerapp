import { useUser } from "../../context/UserContext";
import AddressBlock from "../../components/AddressBlock";
import { useEffect } from "react";
import { View } from "react-native";
import CustomHeader from "../../components/CustomHeader";
import { ScrollView } from "moti";

export default function EditAddressScreen() {
  const { addresses, fetchAddresses } = useUser();

  useEffect(() => {
    fetchAddresses(); // cargas direcciones al entrar
  }, []);

  return (
    <View>
      <CustomHeader title="Editar Dirección:" showBack/>
      <ScrollView contentContainerStyle={{marginHorizontal:10}}>
        {addresses.map(addr => (
        <AddressBlock
          key={addr.id}
          addressId={addr.id}
          initialData={addr}   // 👈 envías la data para autocompletar
        />
      ))}
      </ScrollView>
      
    </View>
  );
}
