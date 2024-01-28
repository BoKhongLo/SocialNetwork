import { View, Text, Image } from "react-native";
import React from "react";
import settingChat from "../../styles/ChatStyles/settingStyle";

const Infor = ({receivedData}) => {
  return (
    <View style={settingChat.avtContainer}>
      {receivedData && receivedData.imgDisplay? (
        <Image
        style={settingChat.avt}
           source={receivedData.imgDisplay}
        />
      ) : receivedData && receivedData.isSingle == true ? (
        <Image
        style={settingChat.avt}
           source={require("../../../assets/img/avt.png")}
        />
      ) :
      (
        <Image
        style={settingChat.avt}
          source={require("../../../assets/img/avt.png")}
        />
      )}
      <Text style={settingChat.name}>{receivedData.title}</Text>
    </View>
  );
};

export default Infor;
