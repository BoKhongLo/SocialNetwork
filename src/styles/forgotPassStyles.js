import { StyleSheet } from "react-native";

const forgotPass = StyleSheet.create({
  headerContainer: { flexDirection: "row", alignItems: "center" },
  formContainer: { marginVertical: 30, marginHorizontal: 20 },
  headerButton: { height: 40, width: 40 },
  title: { fontSize: 20, fontWeight: "500" },
  text: { fontSize: 27, fontWeight: "700" },
  textInput: {
    borderRadius: 4,
    marginBottom: 60,
    borderBottomWidth: 0.5,

  },
  buttonNext: {
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    borderRadius: 40,
    marginTop: 25,
  },
  buttonText: { fontWeight: "500", color: "#fff", fontSize: 20, padding: 18 },
  itemVerify: { borderWidth: 1, borderRadius: 50, paddingHorizontal: 14 },
  numberVerify: { fontSize: 35 },
  itemVeryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
});

export default forgotPass;
