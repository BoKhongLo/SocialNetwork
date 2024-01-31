import { StyleSheet, fontWeight } from "react-native";

const settingChat = StyleSheet.create({
  headerContainer: { flexDirection: "row", alignItems: "center" },
  button: { height: 40, width: 40 },
  buttonContainer: { borderRadius: 20, borderWidth: 0.5, marginTop: 10 },
  avtContainer: {
    height: 150,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    elevation: 8,
    marginVertical: 20,
    alignItems: "center",
  },
  avt: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: "black",
    marginTop: 10,
    marginRight: -10,
  },
  editContainer: {
    height: 400,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    elevation: 10,
  },

  editItem: { fontSize: 18, marginVertical: 5 },
  editItemContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#808080",
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
    marginHorizontal: 10,
    color: "grey",
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 10,

  },
  nicknameContainer: {
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    elevation: 7,
    margin: 10,
    justifyContent: "space-between",
  },
  nicknameItem: {
    flexDirection: "row",
    margin: 10,
  },
  avtCustom: {
    height: 50,
    width: 50,
    borderRadius: 30,
    backgroundColor: "black",
    marginRight: 10,
  },
  textInputContainer: {
    borderBottomWidth: 1,
    flex: 1,
    borderColor: "#808080",
  },
});

export default settingChat;
