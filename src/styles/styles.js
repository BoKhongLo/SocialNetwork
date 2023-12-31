import { StyleSheet } from "react-native";
import { TouchableHighlight } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'white',
    backgroundColor: "black",
    flex: 1,
  },
  headerContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 20,
  },

  LoginContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 12,
  },

  logoContainer: {
    alignItems: "center",
    marginTop: 60,
  },

  imgLogo: {
    height: 110,
    width: 100,
    marginBottom: 70,
  },
  logo: {
    // marginTop:20,
    width: 120,
    height: 50,
    resizeMode: "contain",
  },
  iconContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  icon: {
    width: 30,
    height: 30,
    marginLeft: 10,
    resizeMode: "contain",
  },
  unreadBadge: {
    backgroundColor: "#FF3250",
    width: 7,
    height: 7,
    borderRadius: 5,
  },
  unreadBadgeText: {
    color: "white",
    fontSize: 600,
  },

  story: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginLeft: 6,
    borderWidth: 3,
    borderColor: "ff8501",
  },

  // Login form styles
  wrapper: {
    marginBottom: 80,
    justifyContent:'center',
    marginLeft:10,
    marginRight:10
  },
  inputField: {
    borderRadius: 4,
    padding: 15,
    marginBottom: 10,
    borderBottomWidth:0.5,
    marginTop: 10,
  },
  buttonLogin: {
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    borderRadius: 40,
    marginTop:25,
  },
  buttonLoginText: {
    fontWeight: "500",
    color: "#fff",
    fontSize: 20,
    padding: 18,
  },
  signupContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginTop: 50,
  },

  // Bottom tabs styles
  BottomTabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: 50,
    paddingTop: 10,
  },
  BottomTabIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
    resizeMode: "contain",
  },

  // Stories styles.
  stroyImg: {
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#ff8501",
  },

  iconforAll:{
    width: 40,
    height: 40,
  }
});

export default styles;
