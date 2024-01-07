import { StyleSheet, fontWeight } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const profileStyle = StyleSheet.create({
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "black",
  },
  editContainer: {
    backgroundColor: "grey",
    padding: 4,
    borderRadius: 7,
    paddingVertical: 5,
    flex: 0.5,
    marginRight: 5,
  },
  textEdit: {
    marginHorizontal: 10,
    alignSelf: "center",
  },
  userNameStyles: {
    fontWeight: "700",
    fontSize: hp("3%"),
  },
  fieldContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  textField: {
    flex: 0.3,
    fontSize: 17,
  },
  inputField: {
    borderColor: "gray",
    borderBottomWidth: 1,
    flex: 0.7,
  },
  numInfor: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  tell: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B0B0B0",
    borderRadius: 20,
    marginRight: 20,
  },
  bietdanhContainer: {
    borderRadius: 10,
    paddingRight: 10,
    paddingLeft: 10,
    alignContent: "center",
    backgroundColor: "#B0B0B0",
  },
  
});

export default profileStyle;
