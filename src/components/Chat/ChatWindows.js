import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { GiftedChat, Send, Bubble } from "react-native-gifted-chat";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Divider } from "react-native-elements";
import chat from "../../styles/chatStyles";
import { getUserDataAsync, getRoomchatAsync, getAllIdUserLocal, getDataUserLocal, updateAccessTokenAsync, getSocketIO } from "../../util";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ChatWindows = ({ user }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute()
  const receivedData = route.params?.data;

  const [dataRoomchat, setDataRoomchat] = useState({
    description: "",
    id: "",
    imgDisplay: "",
    member: [],
    memberOut: [],
    title: "",
    ownerUserId: "",
    currentUserId: "",
    data: [],
    imgMembers: {},
    nameMembers: {}
  });


  useEffect(() => {
    const fetchData = async () => {
      if (receivedData == null) {
        navigation.navigate('main');
      }

      const keys = await getAllIdUserLocal();
      const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);

      const dataRoomchatAsync = await getRoomchatAsync(
        receivedData.id,
        dataUserLocal.accessToken
      )
      if ("errors" in dataRoomchatAsync) {
        const dataUpdate = await updateAccessTokenAsync(dataUserLocal.id, dataUserLocal.refreshToken)
        dataUserLocal.accessToken = dataUpdate.accessToken;
        dataRoomchatAsync = await getRoomchatAsync(dataUpdate.id, dataUpdate.accessToken)
      }

      const newRoomchat = { ...dataRoomchat }
      for (let member of dataRoomchatAsync.member) {
        let dataUserAsync = await getUserDataAsync(member, dataUserLocal.accessToken)
        newRoomchat.imgMembers[member] = dataUserAsync.detail.avatarUrl;
        newRoomchat.nameMembers[member] = dataUserAsync.detail.name;
      }
      for (let member of dataRoomchatAsync.memberOut) {
        let dataUserAsync = await getUserDataAsync(member, dataUserLocal.accessToken)
        newRoomchat.imgMembers[member] = dataUserAsync.detail.avatarUrl;
        newRoomchat.nameMembers[member] = dataUserAsync.detail.name;
      }
      newRoomchat.currentUserId = dataUserLocal.id;
      newRoomchat.title = receivedData.title;
      newRoomchat.member = dataRoomchatAsync.member;
      newRoomchat.imgDisplay = receivedData.imgDisplay;
      newRoomchat.memberOut = dataRoomchatAsync.memberOut;
      newRoomchat.id = dataRoomchatAsync.id;
      newRoomchat.data = dataRoomchatAsync.data;
      if (dataRoomchatAsync.ownerUserId) newRoomchat.ownerUserId = dataRoomchatAsync.ownerUserId;
      if (dataRoomchatAsync.description) newRoomchat.description = dataRoomchatAsync.description;
      setDataRoomchat(newRoomchat);


    };

    fetchData();
    return () => {
      if (socket != undefined) {
        socket.disconnect()
      }
    }
  }, []);

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
        flex: 1,
        backgroundColor: "#FFFFFF"
      }}
    >
      <Header userProfile={receivedData} />
      <Divider width={1} orientation="vertical" />
      <Content roomProfile={dataRoomchat} />
      <View>
        <Text></Text>
      </View>
    </View>
  );
};
//justificontent:'space-between'
const Header = ({ userProfile }) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: "row",
        height: heightPercentageToDP("8%"),
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("chat")}
        style={{ padding: 10 }}
      >
        <Image
          style={{ height: 40, width: 40 }}
          source={require("../../../assets/dummyicon/left_line_64.png")}
        />
      </TouchableOpacity>
      <Image style={chat.avtChat} source={userProfile.imgDisplay} />
      <Text style={{ fontSize: 20, fontWeight: "500" }}>{userProfile.title}</Text>
      <TouchableOpacity style={{ padding: 10 }}>
        <Image
          style={{ height: 30, width: 30 }}
          source={require("../../../assets/dummyicon/menu.png")}
        />
      </TouchableOpacity>
    </View>
  );
};

const Content = ({ roomProfile }) => {
  const [messages, setMessages] = useState([])
  const [socket, setSocket] = useState(undefined);
  const navigation = useNavigation();

  useEffect(() => {
    let DataRoomInit = []
    for (let message of roomProfile.data) {
      if (message.isDisplay == false) continue;
      let newMessage = {
        _id: message.id,
        text: message.content,
        createdAt: new Date(message.created_at),
        user: {
          _id: message.userId,
          name: roomProfile.nameMembers[message.userId],
          avatar: roomProfile.imgMembers[message.userId]
        }
      }
      if (message.fileUrl.length > 0) {
        newMessage.image = message.fileUrl[0]
      }
      DataRoomInit.push(newMessage)
    }
    setMessages(DataRoomInit.reverse());
    const fetchData = async () => {
      const keys = await getAllIdUserLocal();
      const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);

      const dataUpdate = await updateAccessTokenAsync(dataUserLocal.id, dataUserLocal.refreshToken);

      if ("errors" in dataUpdate) {
        navigation.navigate("chat")
      }

      dataUserLocal.accessToken = dataUpdate.accessToken;
      const newSocket = getSocketIO(dataUserLocal.accessToken)
      setSocket(newSocket);
    }
    fetchData()
  }, [roomProfile]);

  useEffect(() => {
    if (socket == undefined) return;
    if (roomProfile.id === "") return;
    socket.on('newMessage', async (message) => {
      if (message.isDisplay == false) return;

      if (message.roomId != roomProfile.id) return;

      let newMessage = {
        _id: message.id,
        text: message.content,
        createdAt: new Date(message.created_at),
        user: {
          _id: message.userId,
          name: roomProfile.nameMembers[message.userId],
          avatar: roomProfile.imgMembers[message.userId]
        }
      }
      if (message.fileUrl.length > 0) {
        newMessage.image = message.fileUrl[0]
      }
      setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage]));
    })

  }, [socket, roomProfile])

  const onSend = useCallback((messages = []) => {
    if (socket == undefined) return;

    socket.emit("sendMessage", { userId: roomProfile.currentUserId, content: messages[0].text, fileUrl: [], roomchatId: roomProfile.id })
    // setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
  }, [socket, roomProfile])

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#2e64e5',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  };

  const scrollToBottomComponent = () => {
    return (
      <FontAwesome name='angle-double-down' size={22} color='#333' />
    );
  }

  // Render send button
  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View>
          <MaterialCommunityIcons
            name="send-circle"
            style={{ marginBottom: 5, marginRight: 5 }}
            size={32}
            color="#2e64e5"
          />
        </View>
      </Send>
    );
  };


  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      // renderMessage={renderMessage}
      // renderInputToolbar={renderInputToolbar}
      renderSend={renderSend}
      user={{
        _id: roomProfile.currentUserId,
      }}
      renderBubble={renderBubble}
      scrollToBottom={true}
      scrollToBottomComponent={scrollToBottomComponent}
      alwaysShowSend
      showAvatarForEveryMessage={true}
      showUserAvatar={true}
    />
  );
};

export default ChatWindows;
