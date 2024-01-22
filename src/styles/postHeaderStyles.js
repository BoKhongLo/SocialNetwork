import { StyleSheet } from "react-native";
import { useFonts } from 'expo-font';
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";

const headerPostStyles = StyleSheet.create({
  containerHeaderPost: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 5,
    marginLeft: 12,
    alignItems: "center",
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 50,
    borderWidth: 1,
  },

  userName: {
    fontWeight:'600',
    marginTop: 8,
    marginLeft: 5,

  },
  frame: {
    borderWidth: 1, // Độ rộng của đường viền
    borderColor: "black", // Màu của đường viền
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    // resizeMode: "contain",
    // alignItems: "center",
    // height:400,
    // height: "auto",
  },

  postFooterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 20,
  },
  commentsIcon: {
    height: 30,
    width: 30,
    marginTop: 5,
    marginLeft: 10,
  },

  likes:{
    fontWeight: '600',
  },
  ItemFooterContainer:{
    flexDirection: 'row',
    justifyContent: "flex-start",
  },

  caption:{
    fontWeight: '500',
  },

  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    resizeMode: "contain",
  },
});

export default headerPostStyles;
