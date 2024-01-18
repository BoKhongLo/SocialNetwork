import { View, Text, Image,TouchableOpacity } from "react-native";
import React from "react";
import settingChat from "../../../styles/ChatStyles/settingStyle";
import { useNavigation, useRoute } from "@react-navigation/native";

const Header = () => {
    const navigation = useNavigation();

  return (
    <View style={settingChat.headerContainer}>
      <TouchableOpacity onPress={()=>navigation.goBack()}>
        <Image
          style={settingChat.button}
          source={require("../../../../assets/dummyicon/left_line_64.png")}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;