import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import React, { useState, useEffect, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { GiftedChat, Send, Bubble } from "react-native-gifted-chat";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Divider } from "react-native-elements";
import chat from "../../styles/ChatStyles/chatStyles";
import {
  getUserDataAsync,
  getRoomchatAsync,
  getAllIdUserLocal,
  getDataUserLocal,
  updateAccessTokenAsync,
  getSocketIO,
  uploadFile,
  removeMessageAsync,
} from "../../util";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as DocumentPicker from "expo-document-picker";
import { FileUploadDto, ValidateMessagesDto } from "../../util/dto";
import { Video, Audio } from "expo-av";

const ChatWindows = ({ user }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
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
    nameMembers: {},
  });
  const [userCurrentData, setUserCurrentData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (receivedData == null) {
        navigation.navigate("main");
      }

      const keys = await getAllIdUserLocal();
      const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
      setUserCurrentData({ ...dataUserLocal });
      const dataRoomchatAsync = await getRoomchatAsync(
        receivedData.id,
        dataUserLocal.accessToken
      );
      if ("errors" in dataRoomchatAsync) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        dataUserLocal.accessToken = dataUpdate.accessToken;
        dataRoomchatAsync = await getRoomchatAsync(
          dataUpdate.id,
          dataUpdate.accessToken
        );
      }

      const newRoomchat = { ...dataRoomchat };
      for (let member of dataRoomchatAsync.member) {
        let dataUserAsync = await getUserDataAsync(
          member,
          dataUserLocal.accessToken
        );
        newRoomchat.imgMembers[member] = dataUserAsync.detail.avatarUrl;
        newRoomchat.nameMembers[member] = dataUserAsync.detail.name;
      }
      for (let member of dataRoomchatAsync.memberOut) {
        let dataUserAsync = await getUserDataAsync(
          member,
          dataUserLocal.accessToken
        );
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
      if (dataRoomchatAsync.ownerUserId)
        newRoomchat.ownerUserId = dataRoomchatAsync.ownerUserId;
      if (dataRoomchatAsync.description)
        newRoomchat.description = dataRoomchatAsync.description;
      setDataRoomchat(newRoomchat);
    };

    fetchData();
  }, []);

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
        flex: 1,
        backgroundColor: "#FFFFFF",
      }}
    >
      <Header userProfile={receivedData} userData={userCurrentData} />
      <Divider width={1} orientation="vertical" />
      <Content roomProfile={dataRoomchat} />
      <View>
        <Text></Text>
      </View>
    </View>
  );
};
//justificontent:'space-between'
const Header = ({ userProfile, userData }) => {
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
        onPress={() => navigation.navigate("chat", { data: userData })}
        style={{ padding: 10 }}
      >
        <Image
          style={{ height: 40, width: 40 }}
          source={require("../../../assets/dummyicon/left_line_64.png")}
        />
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: "500" }}>
        {userProfile.title}
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("settingChat")}
        style={{ padding: 10 }}
      >
        <Image
          style={{ height: 25, width: 25 }}
          source={require("../../../assets/dummyicon/menu.png")}
        />
      </TouchableOpacity>
    </View>
  );
};

const Content = ({ roomProfile }) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(undefined);
  const [fileAtt, setFileAtt] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    let DataRoomInit = [];
    let count = 0;
    for (let message of roomProfile.data) {
      if (message.isDisplay == false) continue;

      let newMessage = {
        _id: message.id,
        text: message.content,
        createdAt: new Date(message.created_at),
        user: {
          _id: message.userId,
          name: roomProfile.nameMembers[message.userId],
          avatar: roomProfile.imgMembers[message.userId],
        },
      };
      if (message.fileUrl.length > 0) {
        const imgExt = ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "webp"];
        const videoExt = ["mp4", "avi", "mkv", "mov", "wmv", "flv", "webm"];
        const audioExt = ["mp3", "ogg", "wav", "flac", "aac", "wma", "m4a"];

        const lastElement = message.fileUrl[0].split("/").pop();
        const fileExt = lastElement
          .split("?")[0]
          .split(".")
          .pop()
          .toLowerCase();

        if (imgExt.includes(fileExt)) {
          newMessage.image = message.fileUrl[0];
        } else if (audioExt.includes(fileExt)) {
          newMessage.video = {
            type: "audio",
            uri: message.fileUrl[0],
          };
        } else if (videoExt.includes(fileExt)) {
          newMessage.video = {
            type: "video",
            uri: message.fileUrl[0],
          };
        } else {
          newMessage.file = message.fileUrl[0];
        }
      }
      DataRoomInit.push(newMessage);
      count++;
    }
    setMessages(DataRoomInit.reverse());

    const fetchData = async () => {
      const keys = await getAllIdUserLocal();
      const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);

      const dataUpdate = await updateAccessTokenAsync(
        dataUserLocal.id,
        dataUserLocal.refreshToken
      );

      if ("errors" in dataUpdate) {
        navigation.navigate("chat");
      }

      dataUserLocal.accessToken = dataUpdate.accessToken;
      const newSocket = getSocketIO(dataUserLocal.accessToken);
      setSocket(newSocket);
    };
    fetchData();

    if (roomProfile.id === "") return;
    if (socket == undefined) return;
    socket.on("newMessage", async (message) => {
      if (message.isDisplay == false) return;

      if (message.roomId != roomProfile.id) return;

      let newMessage = {
        _id: message.id,
        text: message.content,
        createdAt: new Date(message.created_at),
        user: {
          _id: message.userId,
          name: roomProfile.nameMembers[message.userId],
          avatar: roomProfile.imgMembers[message.userId],
        },
      };
      if (message.fileUrl.length > 0) {
        const imgExt = [
          "jpg",
          "jpeg",
          "png",
          "gif",
          "bmp",
          "tiff",
          "webp",
          "raf",
        ];
        const videoExt = ["mp4", "avi", "mkv", "mov", "wmv", "flv", "webm"];
        const audioExt = ["mp3", "ogg", "wav", "flac", "aac", "wma", "m4a"];
        const lastElement = message.fileUrl[0].split("/").pop();
        const fileExt = lastElement
          .split("?")[0]
          .split(".")
          .pop()
          .toLowerCase();
        if (imgExt.includes(fileExt)) {
          newMessage.image = message.fileUrl[0];
        } else if (audioExt.includes(fileExt)) {
          newMessage.video = {
            type: "audio",
            uri: message.fileUrl[0],
          };
        } else if (videoExt.includes(fileExt)) {
          newMessage.video = {
            type: "video",
            uri: message.fileUrl[0],
          };
        } else {
          newMessage.file = message.fileUrl[0];
        }
      }
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [newMessage])
      );
    });

    socket.on("removeMessage", async (message) => {
      setMessages((previousState) => {
        return previousState.filter(
          (messages) => messages._id !== message.messageId
        );
      });
    });
  }, [roomProfile]);

  const onSend = useCallback(
    (messages = []) => {
      if (socket == undefined) return;

      socket.emit("sendMessage", {
        userId: roomProfile.currentUserId,
        content: messages[0].text,
        fileUrl: [],
        roomchatId: roomProfile.id,
      });
    },
    [socket, roomProfile]
  );

  const onDelete = useCallback(
    async (messageIdToDelete) => {
      if (roomProfile.id === "") return;
      const dto = new ValidateMessagesDto(
        roomProfile.currentUserId,
        roomProfile.id,
        messageIdToDelete
      );
      const keys = await getAllIdUserLocal();
      const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);

      const data = await removeMessageAsync(dto, dataUserLocal.accessToken);
      if ("errors" in data) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        data = await removeMessageAsync(dto, dataUpdate.accessToken);
      }
    },
    [roomProfile]
  );

  const onLongPress = async (context, message) => {
    if (roomProfile.id === "") return;

    if (message.user._id === roomProfile.currentUserId) {
      const options = ["Copy", "Delete Message", "Cancel"];
      const cancelButtonIndex = options.length - 1;
      context.actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        async (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              await Clipboard.setStringAsync(message.text);
              break;
            case 1:
              onDelete(message._id);
              break;
          }
        }
      );
    } else {
      const options = ["Copy", "Cancel"];
      const cancelButtonIndex = options.length - 1;
      context.actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        async (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              await Clipboard.setStringAsync(message.text);
              break;
          }
        }
      );
    }
  };

  const renderMessageVideo = (props) => {
    const { currentMessage } = props;
    return (
      <View style={chat.videoContainer}>
        {currentMessage.video.type === "video" && (
          <Video
            style={chat.videoStyles}
            source={{
              uri: currentMessage.video.uri,
            }}
            useNativeControls
            resizeMode="contain"
          />
        )}

        {currentMessage.video.type === "audio" && (
          <View>
            <Video
              style={chat.audioStyles}
              source={{
                uri: currentMessage.video.uri,
              }}
              useNativeControls
              resizeMode="contain"
            />
          </View>
        )}
      </View>
    );
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: ['image/*','video/*','audio/*'],
      multiple: true,
      copyToCacheDirectory: true,
    });

    if (result.type !== "success") return;
    if (socket == undefined) return;
    if (roomProfile.id === "") return;

    const keys = await getAllIdUserLocal();
    const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
    const dto = new FileUploadDto(
      dataLocal.id,
      result.uri,
      result.name,
      result.mimeType
    );
    const data = await uploadFile(dto, dataLocal.accessToken);
    if (data == null) {
      const dataUpdate = await updateAccessTokenAsync(
        dataLocal.id,
        dataLocal.refreshToken
      );
      data = await uploadFile(dto, dataUpdate.accessToken);
    }

    socket.emit("sendMessage", {
      userId: dataLocal.id,
      content: "",
      fileUrl: [data.url],
      roomchatId: roomProfile.id,
    });
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#2e64e5",
          },
        }}
        textStyle={{
          right: {
            color: "#fff",
          },
        }}
      />
    );
  };

  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color="#333" />;
  };

  // Render send button
  const renderSend = (props) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={pickDocument}>
          <View>
            <FontAwesome
              name="file"
              style={{ marginRight: 5, marginTop: 5 }}
              size={30}
              color="#2e64e5"
            />
          </View>
        </TouchableOpacity>
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
      </View>
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      renderSend={renderSend}
      user={{
        _id: roomProfile.currentUserId,
      }}
      timeFormat="HH:mm"
      renderBubble={renderBubble}
      scrollToBottom={true}
      scrollToBottomComponent={scrollToBottomComponent}
      alwaysShowSend
      showAvatarForEveryMessage={false}
      showUserAvatar={true}
      renderMessageVideo={renderMessageVideo}
      onLongPress={onLongPress}
    />
  );
};

export default ChatWindows;
