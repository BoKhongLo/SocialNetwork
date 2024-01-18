import { StyleSheet } from "react-native";

const searchStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    marginBottom: 10,
    backgroundColor: "lightgray",
    borderRadius: 40,
  },
  textInput: {
    padding: 10,
    fontSize: 18,
    flex: 4,
    marginLeft: 10,
  },
  button: {
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  avt: {
    height: 45,
    width: 45,
    borderRadius: 30,
    resizeMode: "contain",
    borderWidth: 0.3,
  },
  addButton: {
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "lightgrey",
  },
});

export default searchStyles;
