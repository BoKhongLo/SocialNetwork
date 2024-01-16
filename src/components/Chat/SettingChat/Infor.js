import { View, Text, Image } from "react-native";
import React from "react";
import settingChat from "../../../styles/ChatStyles/settingStyle";
import { TouchableOpacity } from "react-native-gesture-handler";

const Infor = () => {
  return (
    <View style={settingChat.avtContainer}>
      <Image
        style={settingChat.avt}
        //    source={}
      />
      <Text style={settingChat.name}>name</Text>
    </View>
  );
};

export default Infor;
