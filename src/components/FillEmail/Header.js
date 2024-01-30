import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import forgotPass from "../../styles/forgotPassStyles";
import { useNavigation } from "@react-navigation/native";

const Header = ({receivedData}) => {
  const navigation = useNavigation();

  return (
    <View style={forgotPass.headerContainer}>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Image
          style={forgotPass.headerButton}
          source={require("../../../assets/dummyicon/left_line_64.png")}
        />
      </TouchableOpacity>
      <Text style={forgotPass.title}>
      {receivedData.type === "SignUp" ? "Sign Up" : receivedData.type === "ForgotPassword" && "Forgot Password"}
      </Text>
    </View>
  );
};

export default Header;
