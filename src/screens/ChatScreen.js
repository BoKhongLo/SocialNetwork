import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import Chats from "./../components/Chat/Chats";
import Header from "./../components/Chat/Header";
import Search from "./../components/Chat/Search";
import chat from "../styles/chatStyles";
import { useNavigation, useRoute } from '@react-navigation/native';
import { getUserDataAsync, getAllRoomchatAsync, updateAccessTokenAsync, getSocketIO } from "../util";
const ChatScreen = ({}) => {
  const route = useRoute();
  const navigation = useNavigation();
  const receivedData = route.params?.data;
  const insets = useSafeAreaInsets();
  const [userProfile, setUserProfile] = useState({
    username: "",
    avatarUrl: require("../../assets/img/avt.png"),
    friends: [],
    nickName: "",
  });
  const [dataRoomchat, setDataRoomchat] = useState([]);
  const [socket, setSocket] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      if (receivedData == null) {
        navigation.navigate('main');
      }
      const dataUserLocal = receivedData;

      const dataUserAsync = await getUserDataAsync(
        dataUserLocal.id,
        dataUserLocal.accessToken
      );

      const dataRoomchatAsync  = await getAllRoomchatAsync(
        dataUserLocal.id,
        dataUserLocal.accessToken
      )

      const newProfile = { ...userProfile };

      if ("errors" in dataUserAsync) {
        const dataUpdate = await updateAccessTokenAsync(dataUserLocal.id, dataUserLocal.refreshToken)
        dataUserLocal.accessToken = dataUpdate.accessToken;
        dataUserAsync = await getUserDataAsync(dataUpdate.id, dataUpdate.accessToken)
        dataRoomchatAsync = await getAllRoomchatAsync(dataUpdate.id, dataUpdate.accessToken)
      }

      if ("errors" in dataUserAsync) {
        navigation.navigate('main');
      }

      const newSocket = await getSocketIO(dataUserLocal.accessToken)
      setSocket(newSocket);
      if (!("errors" in dataRoomchatAsync)) {
        for (let item in dataRoomchatAsync) { 
          if(dataRoomchatAsync[item].isSingle == true) {
            for (let user of dataRoomchatAsync[item].member) {
              if (user == dataUserLocal.id) continue;
              const dataFriend = await getUserDataAsync(user, dataUserLocal.accessToken)
              dataRoomchatAsync[item].title = dataFriend.detail.name;

              if (!dataFriend.detail.avatarUrl) dataRoomchatAsync[item].imgDisplay = require("../../assets/img/avt.png");
              else dataRoomchatAsync[item].imgDisplay = {uri : dataFriend.detail.avatarUrl};
              break;
            }
          }
        }
      }
      console.log(dataRoomchatAsync)

      const { detail, id, friends } = dataUserAsync;

      newProfile.id = id;
 
      if (detail) {
        if (detail.name) newProfile.username = detail.name;
        if (detail.avatarUrl ) newProfile.avatarUrl = {uri : detail.avatarUrl};
        if (detail.nickName) newProfile.nickName = detail.nickName;
        newProfile.friends = friends;
      }
      setUserProfile(newProfile);
      setDataRoomchat(dataRoomchatAsync)
    };

    fetchData();
    return () => {
      if (socket != undefined) {
        socket.disconnect()
      }
    }
  }, []);

  useEffect(()=> {
    const dataUserLocal = receivedData;
    if (socket == undefined) return;
    socket.on('newRoomCreated', async (roomchat) => {
      const newRoom = {...roomchat}
      if (roomchat.isSingle == true) {
        const userContact = roomchat.member.filter(item => item !== receivedData.id)[0];
        const dataFriend = await getUserDataAsync(userContact, receivedData.accessToken);
        if ("errors" in dataFriend) {
          const dataUpdate = await updateAccessTokenAsync(dataUserLocal.id, dataUserLocal.refreshToken)
          dataUserLocal.accessToken = dataUpdate.accessToken;
          dataFriend = await getUserDataAsync(dataUpdate.id, dataUpdate.accessToken)
        }
        if ("errors" in dataFriend) return;

        newRoom.title = dataFriend.detail.name;
        if (!dataFriend.detail.avatarUrl) newRoom.imgDisplay = require("../../assets/img/avt.png");
        else newRoom.imgDisplay = {uri : dataFriend.detail.avatarUrl};
      }

      setDataRoomchat((preRoom) => [...preRoom, newRoom]);

      return () => {
        if (socket != undefined) {
          socket.disconnect()
        }
      }
  })

  }, [socket]);
  return (
    <View style={chat.container}>
      <View
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        <Header user={userProfile} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <Search dataRoomchat={dataRoomchat} />
          <Chats dataRoomchat={dataRoomchat}/>
        </ScrollView>
      </View>
    </View>
  );
};

export default ChatScreen;
