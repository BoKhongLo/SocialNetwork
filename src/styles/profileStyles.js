import { StyleSheet, fontWeight } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const profileStyle = StyleSheet.create({
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 80,
    borderWidth: 0.4,
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
    flexDirection:'row',
    justifyContent: "center",
    alignItems: "center",
    marginRight:20,
    marginLeft:20
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
  container: {
    marginBottom: 80,
    justifyContent:'center',
    marginLeft:10,
    marginRight:10
  },
  input: {
    borderRadius: 4,
    padding: 15,
    marginBottom: 10,
    borderBottomWidth:0.5,
    marginTop: 10,
  },
  buttonText : {
    fontWeight: "500",
    color: "#fff",
    fontSize: 20,
    padding: 18,
  },
  buttonContainer:{
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    borderRadius: 40,
    marginTop:25,
  }
});

export default profileStyle;
