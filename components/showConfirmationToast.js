import Toast from "react-native-toast-message";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export const showConfirmationToast = (message, onConfirm, onCancel) => {
  Toast.show({
    type: 'custom', // puedes dejar 'success' o 'error' si no quieres render
    position: 'top',
    visibilityTime: 5000,
    autoHide: false,
    topOffset: 50,
    props: {
      message,
      onConfirm,
      onCancel,
    },
    // ✅ renderizamos custom content
    render: ({ message, onConfirm, onCancel }) => (
      <View style={styles.toastContainer}>
        <Text style={styles.toastText}>{message}</Text>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={onConfirm}>
            <Text style={{ color: "#fff" }}>Aceptar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#aaa" }]}
            onPress={onCancel}
          >
            <Text style={{ color: "#000" }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
  });
};

const styles = StyleSheet.create({
  toastContainer: {
    padding: 12,
    backgroundColor: "#333",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 16,
  },
  toastText: {
    color: "#fff",
    marginBottom: 8,
    fontSize: 16,
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#c5a572",
    borderRadius: 6,
  },
});
