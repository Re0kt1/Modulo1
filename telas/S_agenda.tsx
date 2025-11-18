import { StyleSheet } from "react-native";

export default StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: "#f2f2f2", padding: 20, marginBottom: "12%" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  textBlackBold: { color: "black", fontWeight: "bold", fontSize: 18 },

  searchBox: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },

  filtros: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },

  requiPenden: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    backgroundColor: "#6ab2ffff",
    padding: 10,
    borderRadius: 10,
  },

  requisicoesDenPen: {
    backgroundColor: "white",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },

  confirmBotao: {
    backgroundColor: "#34C759",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
  },

  rejeitarBotao: {
    backgroundColor: "#FF3B30",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },

  mostrarconfirmados: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    backgroundColor: "#3cff6dff",
    padding: 10,
    borderRadius: 10,
  },

  excluirAgen: {
    backgroundColor: "#FF3B30",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: "flex-end",
  },

  modalBase: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modal: {
    backgroundColor: "#808080ff",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    maxWidth: 400,
  },

  barraData: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "white",
  },

  hora: {
    backgroundColor: "#9c5125ff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },

  observ: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: "top",
    backgroundColor: "white",
  },

  cance: {
    backgroundColor: "#ff0000",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
  },
});
