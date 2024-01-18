import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import forgotPass from "../../styles/forgotPassStyles";
import { useNavigation } from "@react-navigation/native";

const Header = () => {
  const navigation = useNavigation();

  return (
    <View style={forgotPass.headerContainer}>
      <TouchableOpacity onPress={() => navigation.navigate("forgotPass")}>
        <Image
          style={forgotPass.headerButton}
          source={require("../../../assets/dummyicon/left_line_64.png")}
        />
      </TouchableOpacity>
      <Text style={forgotPass.title}>Verification</Text>
    </View>
  );
};

export default Header;
