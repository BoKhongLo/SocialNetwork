import { StyleSheet, fontWeight } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Divider } from "react-native-elements";


const postSytles = StyleSheet.create ({
text:{ fontSize: 20},
textInput :{borderBottomWidth: 1, marginBottom: 10, marginLeft: 15 },
button:{height:30,width:30},
image: {
    resizeMode: "contain",
    alignItems: "center",
    height:400,
  },
})

export default postSytles