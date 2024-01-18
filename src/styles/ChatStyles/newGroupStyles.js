import { StyleSheet } from "react-native";

const newGroup = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalContainer: { marginHorizontal: 10 },
  buttonText: { fontSize: 20 },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    alignItems: "center",
  },
  itemAvt: {
    height: 50,
    width: 50,
    borderRadius: 30,
    backgroundColor: "black",
  },
  text: { fontSize: 18 },
  addButton:{
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor:'lightgrey',
    borderRadius:15
  },
  textInputContainer:{
    padding:13,
    backgroundColor:'lightgrey',
    borderRadius:20
  }
});

export default newGroup;
