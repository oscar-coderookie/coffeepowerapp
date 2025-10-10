// components/ComunidadProvinciaPicker.js
import React from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { comunidades } from "../data/spainRegions"; // el JSON que hicimos antes

export default function ComunidadProvinciaPicker({
  valueCA,
  valueProv,
  onChangeCA,
  onChangeProv,
}) {
  const provincias = comunidades.find(ca => ca.nombre === valueCA)?.provincias || [];

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontWeight: "600", marginBottom: 5 }}>Comunidad Autónoma</Text>
      <Picker
        selectedValue={valueCA}
        onValueChange={(value) => {
          onChangeCA(value);
          onChangeProv(""); // Reinicia provincia
        }}
      >
        <Picker.Item label="Selecciona una comunidad" value="" />
        {comunidades.map((ca) => (
          <Picker.Item key={ca.nombre} label={ca.nombre} value={ca.nombre} />
        ))}
      </Picker>

      <Text style={{ fontWeight: "600", marginBottom: 5, marginTop: 10 }}>Provincia</Text>
      <Picker
        enabled={!!valueCA}
        selectedValue={valueProv}
        onValueChange={onChangeProv}
      >
        <Picker.Item label="Selecciona una provincia" value="" />
        {provincias.map((prov) => (
          <Picker.Item key={prov} label={prov} value={prov} />
        ))}
      </Picker>
    </View>
  );
}
