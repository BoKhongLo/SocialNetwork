import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import chat from "../../styles/chatStyles";
import { useNavigation } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const friendList = [
  {
    friendName: "_Mike_",
    friendAVT: require("../../../assets/img/avt.png"),
    time: "3 ",
  },
  {
    friendName: "_sieucapbeoy_",
    friendAVT: require("../../../assets/img/LanAnhAVT.jpg"),
    time: "2",
  }, 
  {
    friendName: "ban 3",
    friendAVT: require("../../../assets/img/avt.png"),
    time: "3",
  },
];

const recomentList = [
  {
    RecomentfriendName: "de xuat 1",
    RcmfriendAVT: require("../../../assets/img/avt.png"),
    detail: "Nhấn để trò chuyện",
  },
];

const Chats = () => {
  
  return (
    <View style={{ flex: 1, height: hp("100%") }}>
      <View>
        <HeaderChats />
        {friendList.map((friend, index) => (
          <ListOfChat key={index} friend={friend} />
        ))}
      </View>
      {/* <View>
        <HeaderRecoments />
        {recomentList.map((recoment, index) => (
          <ListOfRecomentChat key={index} recoment={recoment} />
        ))}
      </View> */}
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

const ListOfChat = ({ friend }) => {
  const navigation = useNavigation();
  return (
    <View>
      <View style={chat.KhungChat}>
        <TouchableOpacity onPress={() => navigation.navigate('chatwindow')}>
          <View style={{ flexDirection: "row" }}>
            <Image style={chat.avtChat} source={friend.friendAVT} />
            <View style={chat.nameChatContainer}>
              <Text style={chat.chatUSerName}> {friend.friendName}</Text>
              <Text> Hoạt động {friend.time} giờ trước</Text>
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

const HeaderRecoments = () => {
  return (
    <View style={chat.TinnhanHeader}>
      <Text style={chat.TinnhanText}>Đề xuất</Text>
    </View>
  );
};

const ListOfRecomentChat = ({ recoment }) => {
  return (
    <View style={chat.KhungChat}>
      <TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          <Image style={chat.avtChat} source={recoment.RcmfriendAVT} />
          <View style={chat.nameChatContainer}>
            <Text style={chat.chatUSerName}>
              {recoment.RecomentfriendName}
            </Text>
            <Text> {recoment.detail} </Text>
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
  );
};

export default Chats;