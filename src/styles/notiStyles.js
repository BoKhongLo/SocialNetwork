import { StyleSheet, fontWeight } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const notistyles = StyleSheet.create({
  headerName: {
    fontWeight: "700",
    fontSize: hp("3%"),
  },
});

export default notistyles;
