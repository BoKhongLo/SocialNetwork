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
    marginVertical: 10,
    flexDirection:'row'
  },
  itemAvt: {
    height: 50,
    width: 50,
    borderRadius: 30,
  },
  text: { fontSize: 18 },
  addButton:{
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor:'lightgrey',
    borderRadius:15,
    elevation:5,
    marginHorizontal:8,
    marginVertical:2
  },
  textInputContainer:{
    padding:13,
    backgroundColor:'lightgrey',
    borderRadius:20,
    borderRadius:30,
    elevation:5
  }
});

export default newGroup;