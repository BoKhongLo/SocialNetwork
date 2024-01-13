import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import chat from "../../styles/chatStyles";
import { useNavigation } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";


const Chats = ({ dataRoomchat }) => {

  return (
    <View style={{ flex: 1, height: hp("100%") }}>
      <View>
        <HeaderChats />
        {dataRoomchat.map((roomchat, index) => (
          <ListOfChat key={index} roomchat={roomchat} />
        ))}
      </View>

    </View>
  );
};

const HeaderChats = () => {
  return (
    <View style={chat.TinnhanHeader}>
      <Text style={chat.TinnhanText}>Tin nhắn</Text>
      <TouchableOpacity>
        <Text style={chat.dangchoText}>Tin nhắn đang chờ</Text>
      </TouchableOpacity>
    </View>
  );
};

const ListOfChat = ({ roomchat }) => {
  const navigation = useNavigation();
  const options = { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'};
  return (
    <View>
      <View style={chat.KhungChat}>
        <TouchableOpacity onPress={() => navigation.navigate('chatwindow', { data: roomchat })}>
          <View style={{ flexDirection: "row" }}>
            <Image style={chat.avtChat} source={roomchat.imgDisplay} />
            <View style={chat.nameChatContainer}>
              <Text style={chat.chatUSerName}> {roomchat.title}</Text>
              <Text>{new Date(roomchat.updated_at).toLocaleString('vi-VN', options)}</Text>

            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            style={chat.iconVideoCall}
            source={require("../../../assets/dummyicon/icons8-video-chat-48.png")}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default Chats;