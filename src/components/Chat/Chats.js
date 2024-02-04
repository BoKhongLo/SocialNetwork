import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import chat from "../../styles/ChatStyles/chatStyles";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Chats = ({ dataRoomchat }) => {
  console.log(dataRoomchat)
  return (
    <View
     
     style={{ flex: 1, height: hp("100%") }}>
      <View>
        <HeaderChats />
        {dataRoomchat != undefined && dataRoomchat.map((roomchat, index) => (
          <ListOfChat key={index} roomchat={roomchat} />
        ))}
      </View>
    </View>
  );
};

const HeaderChats = () => {
  return (
    <View style={chat.TinnhanHeader}>
      <Text style={chat.TinnhanText}>Chats</Text>
    </View>
  );
};

const ListOfChat = ({ roomchat }) => {
  const navigation = useNavigation();
  const options = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  
  return (
    <View>
      <View style={chat.KhungChat}>
        <TouchableOpacity
        onLongPress={()=> alertDeleteChat()}
          onPress={() => navigation.replace("chatwindow", { data: roomchat })}
        >
          <View style={{ flexDirection: "row" }}>
            <Image style={chat.avtChat} source={roomchat.imgDisplay} />
            <View style={chat.nameChatContainer}>
              <Text style={chat.chatUSerName}> {roomchat.title}</Text>
              <Text>
                {new Date(roomchat.updated_at).toLocaleString("vi-VN", options)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chats;
