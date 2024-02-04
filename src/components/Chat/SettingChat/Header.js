import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import settingChat from "../../../styles/ChatStyles/settingStyle";
import { useNavigation, useRoute } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const Header = ({ receivedData }) => {
  const navigation = useNavigation();

  return (
    <View style={settingChat.headerContainer}>
      <TouchableOpacity
        onPress={() => navigation.replace("chatwindow", { data: receivedData })}
        style={settingChat.button}
      >
        <FontAwesome
          name="angle-left"
          size={40}
          color="black"
          style={{ textAlignVertical: "bottom", marginLeft: 2 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
