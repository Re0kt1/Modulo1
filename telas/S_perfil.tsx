import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    width: "100%",
    marginBottom: "12%",
  },
  imageContainer: {
    marginTop: 40,
    borderWidth: 3,
    borderColor: "#007AFF",
    borderRadius: 100,
    padding: 3,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 15,
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  infoBox: {
    backgroundColor: "white",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  infoValue: {
    color: "#666",
  },
})