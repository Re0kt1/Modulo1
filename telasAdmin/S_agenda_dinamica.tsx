import { TextStyle, ViewStyle } from "react-native";

export const filtroBotao = (ativo: boolean): ViewStyle => ({
  backgroundColor: ativo ? "#007AFF" : "#ccc",
  padding: 10,
  borderRadius: 10,
  flex: 1,
  marginHorizontal: 3,
  alignItems: "center",
});

export const textoFiltro: TextStyle = {
  color: "white",
  fontWeight: "bold",
};

export const modalConfirmButton = (isConfirm: boolean): ViewStyle => ({
  backgroundColor: isConfirm ? "#34C759" : "#FF3B30",
  paddingVertical: 8,
  paddingHorizontal: 15,
  borderRadius: 8,
});
