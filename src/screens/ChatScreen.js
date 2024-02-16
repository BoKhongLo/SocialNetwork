import {
  View,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import Chats from "./../components/Chat/Chats";
import Header from "./../components/Chat/Header";
import Search from "./../components/Chat/Search";
import chat from "../styles/ChatStyles/chatStyles";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  getUserDataLiteAsync,
  getUserDataAsync,
  getAllRoomchatAsync,
  updateAccessTokenAsync,
  getSocketIO,
  saveDataUserLocal
} from "../util";
import LoadingAnimation from "../components/Loading/loadingAnimation";

const ChatScreen = ({}) => {
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const receivedData = route.params?.data;
  const insets = useSafeAreaInsets();
  const [userProfile, setUserProfile] = useState({
    username: "",
    avatarUrl: {uri: "https://firebasestorage.googleapis.com/v0/b/testgame-d8af2.appspot.com/o/avt.png?alt=media&token=b8108af6-1f90-4512-91f5-45091ca7351f"},
    friends: [],
    nickName: "",
  });
  const [dataRoomchat, setDataRoomchat] = useState([]);
  const [socket, setSocket] = useState(undefined);
  const [dataRoomchatTmp, setDataRoomchatTmp] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (receivedData == null) {
        navigation.navigate("main");
      }
      setIsLoading(true);
      const dataUserLocal = receivedData;

      let dataUserAsync = await getUserDataLiteAsync(
        dataUserLocal.id,
        dataUserLocal.accessToken
      );

      let dataRoomchatAsync = await getAllRoomchatAsync(
        dataUserLocal.id,
        dataUserLocal.accessToken
      );

      const newProfile = { ...userProfile };

      if ("errors" in dataUserAsync) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        await saveDataUserLocal(dataUpdate.id, dataUpdate)
        dataUserLocal.accessToken = dataUpdate.accessToken;
        dataUserAsync = await getUserDataLiteAsync(
          dataUpdate.id,
          dataUpdate.accessToken
        );
        dataRoomchatAsync = await getAllRoomchatAsync(
          dataUpdate.id,
          dataUpdate.accessToken
        );
      }

      if ("errors" in dataUserAsync) {
        setIsLoading(false);
        navigation.navigate("main");
      }
      setIsLoading(false);
      const newSocket = await getSocketIO(dataUserLocal.accessToken);
      setSocket(newSocket);
      if (!("errors" in dataRoomchatAsync)) {
        for (let item in dataRoomchatAsync) {
          if (dataRoomchatAsync[item].isSingle == true) {
            for (let user of dataRoomchatAsync[item].member) {
              if (user == dataUserLocal.id) continue;
              const dataFriend = await getUserDataLiteAsync(
                user,
                dataUserLocal.accessToken
              );
              if (dataFriend.id in dataRoomchatAsync[item].memberNickname) {
                dataRoomchatAsync[item].title = dataRoomchatAsync[item].memberNickname[dataFriend.id];
              }
              else {
                dataRoomchatAsync[item].title = dataFriend.detail.name;
              }
              if (!dataFriend.detail.avatarUrl)
                dataRoomchatAsync[item].imgDisplay = "https://firebasestorage.googleapis.com/v0/b/testgame-d8af2.appspot.com/o/avt.png?alt=media&token=b8108af6-1f90-4512-91f5-45091ca7351f"
              else
                dataRoomchatAsync[item].imgDisplay = dataFriend.detail.avatarUrl
              break;
            }
          }
        }
      }
      const { detail, id, friends } = dataUserAsync;

      newProfile.id = id;

      if (detail) {
        if (detail.name) newProfile.username = detail.name;
        if (detail.avatarUrl) newProfile.avatarUrl = { uri: detail.avatarUrl };
        if (detail.nickName) newProfile.nickName = detail.nickName;
        newProfile.friends = friends;
      }

      setUserProfile(newProfile);
      dataRoomchatAsync.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      setDataRoomchat(dataRoomchatAsync);
      setDataRoomchatTmp(dataRoomchatAsync);

    };

    fetchData();
    return () => {
      if (socket != undefined) {
        socket.disconnect();
      }
    };
  }, [receivedData]);

  useEffect(() => {
    if (socket == undefined) return;
    const dataUserLocal = receivedData;
    socket.on("newMessage", async (message) => {
      if (message.isDisplay == false) return;
      setDataRoomchat((preData) => {
        let indexRoom = preData.findIndex(item => item.id === message.roomId)
        if (indexRoom == -1) return preData;
        let newData = [...preData];
        newData[indexRoom].updated_at = new Date().toISOString();
        newData.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        return newData;
      })
    });

    socket.on("newRoomCreated", async (roomchat) => {
      console.log(roomchat);
      const newRoom = { ...roomchat };
      if (roomchat.isSingle == true) {
        const userContact = roomchat.member.filter(
          (item) => item !== receivedData.id
        )[0];
        const dataFriend = await getUserDataLiteAsync(
          userContact,
          receivedData.accessToken
        );
        if ("errors" in dataFriend) {
          const dataUpdate = await updateAccessTokenAsync(
            dataUserLocal.id,
            dataUserLocal.refreshToken
          );
          dataUserLocal.accessToken = dataUpdate.accessToken;
          dataFriend = await getUserDataLiteAsync(
            dataUpdate.id,
            dataUpdate.accessToken
          );
        }
        if ("errors" in dataFriend) return;

        newRoom.title = dataFriend.detail.name;
        if (!dataFriend.detail.avatarUrl)
          newRoom.imgDisplay = {uri: "https://firebasestorage.googleapis.com/v0/b/testgame-d8af2.appspot.com/o/avt.png?alt=media&token=b8108af6-1f90-4512-91f5-45091ca7351f"}
        else newRoom.imgDisplay = { uri: dataFriend.detail.avatarUrl };
      }
      else {
        newRoom.imgDisplay = {uri: 'https://firebasestorage.googleapis.com/v0/b/testgame-d8af2.appspot.com/o/room.jpg?alt=media&token=dcef7b37-3d4b-4bca-9159-1275e966b1a7'}
      }
      setDataRoomchat((preRoom) => [...preRoom, newRoom].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));
      setDataRoomchatTmp((preRoom) => [...preRoom, newRoom].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));
    });

    socket.on("removeRoom", async (roomchat) => {
      setDataRoomchat((preRoom) => preRoom.filter(item => item.id === roomchat.roomchatId).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));
      setDataRoomchatTmp((preRoom) => preRoom.filter(item => item.id === roomchat.roomchatId).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));
    });
  }, [socket]);

  // const UpdateRoom = (data) => {
  //   console.log("On Get")
  //   setDataRoomchat((preRoom) => {
  //     if (data.id in preRoom) return preRoom;
  //     return [...preRoom, data]
  //   });
    
  //   setDataRoomchatTmp((preRoom) => {
  //     if (data.id in preRoom) return preRoom;
  //     return [...preRoom, data]
  //   });
  // }

  return (
    <View style={chat.container}>
      <View
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left + 10,
          paddingRight: insets.right + 10,
        }}
      >
        <Header user={userProfile} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <Search dataRoomchat={dataRoomchat} onSearch={setDataRoomchatTmp} />
          <Chats dataRoomchat={dataRoomchatTmp} />
          
        </ScrollView>
        
        <LoadingAnimation isVisible={isLoading} />

      </View>
    </View>
  );
};

export default ChatScreen;