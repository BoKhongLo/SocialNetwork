import { StyleSheet } from "react-native";

const cpnNotiStyles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  name: {
    fontWeight: "700",
  },
  nickname: {
    color: "#A9A9A9",
  },
  avt: {
    height: 70,
    width: 70,
    borderRadius: 40,
    backgroundColor: "black",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "lightgrey",
    borderRadius: 10,
    alignSelf: "center",
    marginHorizontal:2
  },
  buttonText: {
    textAlign: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  title:{
    fontSize:15,
    color: "grey",
    marginVertical:10
  }
});

export default cpnNotiStyles;