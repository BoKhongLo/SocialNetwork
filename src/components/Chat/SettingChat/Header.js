import { View, Text, Image,TouchableOpacity } from "react-native";
import React from "react";
import settingChat from "../../../styles/ChatStyles/settingStyle";
import { useNavigation, useRoute } from "@react-navigation/native";

const Header = ({receivedData}) => {
    const navigation = useNavigation();

  return (
    <View style={settingChat.headerContainer}>
<<<<<<< HEAD
      <TouchableOpacity 
      onPress={()=>navigation.navigate("chatwindow", { data: receivedData })}
      >
=======
      <TouchableOpacity onPress={()=>navigation.replace("chatwindow", { data: receivedData })}>
>>>>>>> b4d93f6f76ce3d2876c3635f509282ff96cb04b8
        <Image
          style={settingChat.button}
          source={require("../../../../assets/dummyicon/left_line_64.png")}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
