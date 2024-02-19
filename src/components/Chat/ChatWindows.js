import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert
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
  getUserDataLiteAsync,
  getRoomchatAsync,
  getAllIdUserLocal,
  getDataUserLocal,
  updateAccessTokenAsync,
  getSocketIO,
  uploadFile,
  removeMessageAsync,
  saveDataUserLocal,
} from "../../util";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as DocumentPicker from "expo-document-picker";
import { FileUploadDto, ValidateMessagesDto } from "../../util/dto";
import { Video, Audio } from "expo-av";
import * as WebBrowser from 'expo-web-browser';

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
    isSingle: false,
    ownerUserId: "",
    currentUserId: "",
    data: [],
    imgMembers: {},
    nameMembers: {},
    isBlock: "-1",
  });
  const [userCurrentData, setUserCurrentData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!receivedData) {
        navigation.navigate("main");
      }

      const keys = await getAllIdUserLocal();
      let dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
      setUserCurrentData({ ...dataUserLocal });

      let dataRoomchatAsync = await getRoomchatAsync(
        receivedData.id,
        dataUserLocal.accessToken
      );
      if ("errors" in dataRoomchatAsync) {
        let dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );

        await saveDataUserLocal(dataUpdate.id, dataUpdate);
        dataUserLocal.accessToken = dataUpdate.accessToken;
        dataRoomchatAsync = await getRoomchatAsync(
          receivedData.id,
          dataUpdate.accessToken
        );
      }
      if ("errors" in dataRoomchatAsync) {
        return;
      }

      let newRoomchat = { ...dataRoomchat };

      for (let i = 0; i < dataRoomchatAsync.member.length; i++) {
        let dataUserAsync = await getUserDataLiteAsync(
          dataRoomchatAsync.member[i],
          dataUserLocal.accessToken
        );
        if (dataUserAsync.detail.avatarUrl != undefined && dataUserAsync.detail.avatarUrl != null) {
          newRoomchat.imgMembers[dataRoomchatAsync.member[i]] = dataUserAsync.detail.avatarUrl;
        }
        else {
          newRoomchat.imgMembers[dataRoomchatAsync.member[i]] = "https://firebasestorage.googleapis.com/v0/b/testgame-d8af2.appspot.com/o/avt.png?alt=media&token=b8108af6-1f90-4512-91f5-45091ca7351f"
        }

        if (dataRoomchatAsync.member[i] in dataRoomchatAsync.memberNickname) {
          newRoomchat.nameMembers[dataRoomchatAsync.member[i]] = dataRoomchatAsync.memberNickname[dataRoomchatAsync.member[i]]
        }
        else {
          newRoomchat.nameMembers[dataRoomchatAsync.member[i]] = dataUserAsync.detail.name;
        }

      }

      for (let member of dataRoomchatAsync.memberOut) {
        let dataUserAsync = await getUserDataAsync(
          member.memberId,
          dataUserLocal.accessToken
        );
        if (dataUserAsync && dataUserAsync.detail.avatarUrl != undefined && dataUserAsync.detail.avatarUrl != null) {
          newRoomchat.imgMembers[member.memberId] = dataUserAsync.detail.avatarUrl;
        }
        else {
          newRoomchat.imgMembers[member.memberId] = "https://firebasestorage.googleapis.com/v0/b/testgame-d8af2.appspot.com/o/avt.png?alt=media&token=b8108af6-1f90-4512-91f5-45091ca7351f"
        }
        if (member in dataRoomchatAsync.memberNickname) {
          newRoomchat.nameMembers[member.memberId] = dataRoomchatAsync.memberNickname[member.memberId]
        }
        else {
          newRoomchat.nameMembers[member.memberId] = dataUserAsync.detail.name;
        }
      }

      newRoomchat.currentUserId = dataUserLocal.id;
      newRoomchat.title = receivedData.title;
      newRoomchat.member = dataRoomchatAsync.member;
      newRoomchat.imgDisplay = receivedData.imgDisplay;
      newRoomchat.memberOut = dataRoomchatAsync.memberOut;
      newRoomchat.id = dataRoomchatAsync.id;
      newRoomchat.data = dataRoomchatAsync.data;
      newRoomchat.isSingle = dataRoomchatAsync.isSingle;
      newRoomchat.isBlock = dataRoomchatAsync.isBlock;
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
      <Header roomProfile={receivedData} userData={userCurrentData} />
      <Divider width={1} orientation="vertical" />
      <Content roomProfile={dataRoomchat} />
    </View>
  );
};

const Header = ({ roomProfile, userData }) => {
  const navigation = useNavigation();
  const [dataUser, setDataUser] = useState({});
  const [dataRoomchat, setDataRoomchat] = useState({})

  useEffect(() => {
    setDataUser(userData);
    setDataRoomchat(roomProfile)
  }, [roomProfile, userData])

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
        onPress={() => navigation.replace("chat", { data: dataUser })}
        style={{ padding: 10 }}
      >
        <Image
          style={{ height: 40, width: 40 }}
          source={require("../../../assets/dummyicon/left_line_64.png")}
        />
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: "500" }}>
        {dataRoomchat.title}
      </Text>
      <TouchableOpacity
        onPress={() => {
          if ("isSingle" in dataRoomchat && dataRoomchat.isSingle === true) {
            navigation.replace("settingChat", { data: dataRoomchat })
          }
          else if ("isSingle" in dataRoomchat && dataRoomchat.isSingle === false) {
            navigation.replace("settingGroupChat", { data: dataRoomchat })
          }
        }}
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
  const [contentRoom, setContentRoom] = useState({});
  const [isFetch, setIsFetch] = useState(false);

  useEffect(() => {
    if (!roomProfile) return;
    if (!("id" in roomProfile)) return;
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


    setContentRoom(roomProfile)
    setIsFetch(pre => !pre)

  }, [roomProfile]);

  useEffect(() => {
    const fetchData = async () => {
      const keys = await getAllIdUserLocal();
      let dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);

      let dataUpdate = await updateAccessTokenAsync(
        dataUserLocal.id,
        dataUserLocal.refreshToken
      );

      if ("errors" in dataUpdate) {
        navigation.navigate("chat");
      }

      dataUserLocal.accessToken = dataUpdate.accessToken;
      const newSocket = getSocketIO(dataUserLocal.accessToken);
      setSocket(newSocket);

      newSocket.on("newMessage", async (message) => {
        if (message.isDisplay == false) return;
        if (!("id" in contentRoom)) return;
        if (message.roomId != contentRoom.id) return;

        let newMessage = {
          _id: message.id,
          text: message.content,
          createdAt: new Date(message.created_at),
          user: {
            _id: message.userId,
            name: contentRoom.nameMembers[message.userId],
            avatar: contentRoom.imgMembers[message.userId],
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
        setMessages((previousMessages) => {
          if (previousMessages.findIndex(item => item._id === message.id) !== -1) {
            return previousMessages;
          }
          else {
            return GiftedChat.append(previousMessages, [newMessage]);
          }
        });
      });

      newSocket.on("removeMessage", async (message) => {
        if (!("id" in contentRoom)) return;
        if (message.roomchatId != contentRoom.id) return;
        setMessages((previousState) => {
          return previousState.filter(
            (messages) => messages._id !== message.messageId
          );
        });
      });

      newSocket.on("blockRoomchat", async (payload) => {
        if (!("id" in contentRoom)) return;
        if (payload.roomchatId != contentRoom.id) return;
        let newRoomchat = { ...contentRoom }
        newRoomchat.isBlock = payload.userId;
        setContentRoom(newRoomchat);
      });

      newSocket.on("unblockRoomchat", async (payload) => {
        if (!("id" in contentRoom)) return;
        if (payload.roomchatId != contentRoom.id) return;
        let newRoomchat = { ...contentRoom }
        newRoomchat.isBlock = null;
        setContentRoom(newRoomchat);
      });

      newSocket.on("validateNicknameMember", async (payload) => {
        if (!("id" in contentRoom)) return;
        if (payload.roomchatId != contentRoom.id) return;
        setMessages((previousState) => {
          let newState = [...previousState];
          for (let i = 0; i < newState.length; i++) {
            if (newState[i].user._id === payload.userId) {
              newState[i].user.name = payload.nickName;
            }
          }
          return newState;
        });

        let newRoomchat = { ...contentRoom }
        newRoomchat.nameMembers[payload.userId] = payload.nickName;
        setContentRoom(newRoomchat);
      });

      newSocket.on("removeMember", async (payload) => {
        if (!("id" in contentRoom)) return;
        if (payload.roomchatId != contentRoom.id) return;
        try {
          if (payload.member.includes(contentRoom.currentUserId)) {
            navigation.navigate("main")
          }
        }
        catch (err) {
          console.log(err);
        }
      });

      newSocket.on("addMember", async (payload) => {
        if (!("id" in contentRoom)) return;
        if (payload.roomchatId != contentRoom.id) return;
        let newRoomchat = { ...contentRoom }
        for (let i = 0; i < payload.member.length; i++) {
          if (newRoomchat.member.findIndex(item => item === payload.member[i]) !== -1) continue;

          newRoomchat.member.push(payload.member[i]);
          let tmpDataLite = await getUserDataLiteAsync(payload.member[i], dataUserLocal.accessToken)
          if ("errors" in tmpDataLite) {
            dataUpdate = await updateAccessTokenAsync(dataUserLocal.id, dataUserLocal.refreshToken);
            dataUserLocal.accessToken = dataUpdate.accessToken;
            tmpDataLite = await getUserDataLiteAsync(payload.member[i], dataUserLocal.accessToken)
          }

          if (tmpDataLite.detail.avatarUrl != undefined && tmpDataLite.detail.avatarUrl != null) {
            newRoomchat.imgMembers[payload.member[i]] = tmpDataLite.detail.avatarUrl;
          }
          else {
            newRoomchat.imgMembers[payload.member[i]] = "https://firebasestorage.googleapis.com/v0/b/testgame-d8af2.appspot.com/o/avt.png?alt=media&token=b8108af6-1f90-4512-91f5-45091ca7351f"
          }

          newRoomchat.nameMembers[payload.member[i]] = tmpDataLite.detail.name;
        }
        setContentRoom(newRoomchat);
      });
    };
    fetchData();

  }, [isFetch])

  const onSend = useCallback(
    (messages = []) => {
      if (socket == undefined) return;

      socket.emit("sendMessage", {
        userId: contentRoom.currentUserId,
        content: messages[0].text,
        fileUrl: [],
        roomchatId: contentRoom.id,
      });
    },
    [socket, contentRoom]
  );

  const onDelete = useCallback(
    async (messageIdToDelete) => {
      if (!("id" in contentRoom)) return;
      const dto = new ValidateMessagesDto(
        contentRoom.currentUserId,
        contentRoom.id,
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
    [contentRoom]
  );

  const onLongPress = async (context, message) => {
    if (!("id" in contentRoom)) return;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = message.text.match(urlRegex);
    if (message.user._id === contentRoom.currentUserId) {
      if (urls == null) {
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
      }
      else {
        const options = ["Copy", "Open Link", "Delete Message", "Cancel"];
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
                let result = await WebBrowser.openBrowserAsync(urls[0]);
                break;
              case 2:
                onDelete(message._id);
                break;
            }
          }
        );
      }
    } else {
      if (urls == null) {
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
      else {
        const options = ["Copy", "Open Link", "Cancel"];
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
                let result = await WebBrowser.openBrowserAsync(urls[0]);
                break;
            }
          }
        );
      }
    }
  };
  const renderUsername = (props) => {
    return (
      <View style={{ marginLeft: 10, marginBottom: 5 }}>
        <Text style={{ fontStyle: 'italic', color: "gray" }}>{props.name}</Text>
      </View>
    )
  }
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
      type: ["image/*", "video/*", "audio/*"],
    });

    if (result.type !== "success") {
      return
    }

    if (socket == undefined) return;
    if (contentRoom.id === "") return;

    const keys = await getAllIdUserLocal();
    const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
    let dataUpdate = await updateAccessTokenAsync(
      dataLocal.id,
      dataLocal.refreshToken
    );

    let newUrl = [];
    const dto = new FileUploadDto(
      dataLocal.id,
      result.uri,
      result.name,
      result.mimeType
    );

    let data = await uploadFile(dto, dataUpdate.accessToken);
    if ("message" in data) {
      dataUpdate = await updateAccessTokenAsync(
        dataLocal.id,
        dataLocal.refreshToken
      );
      data = await uploadFile(dto, dataUpdate.accessToken);
    }

    if ("message" in data) {
      Alert.alert(data.message);
      return;
    }

    newUrl.push(data.url);

    socket.emit("sendMessage", {
      userId: dataLocal.id,
      content: "",
      fileUrl: newUrl,
      roomchatId: contentRoom.id,
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
  const renderSend = useCallback((props) => {
    return (
      <View >
        {contentRoom.isBlock == null ? (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={pickDocument}>
              <View>
                <FontAwesome
                  name="file"
                  style={{ marginRight: 5, marginTop: 5 }}
                  size={28}
                  color="#2e64e5"
                />
              </View>
            </TouchableOpacity>
            <Send {...props}>
              <View>
                <MaterialCommunityIcons
                  name="send-circle"
                  style={{ marginBottom: 5, marginRight: 5 }}
                  size={34}
                  color="#2e64e5"
                />
              </View>
            </Send>
          </View>
        ) : contentRoom.isSingle == false && (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={pickDocument}>
              <View>
                <FontAwesome
                  name="file"
                  style={{ marginRight: 5, marginTop: 5 }}
                  size={28}
                  color="#2e64e5"
                />
              </View>
            </TouchableOpacity>
            <Send {...props}>
              <View>
                <MaterialCommunityIcons
                  name="send-circle"
                  style={{ marginBottom: 5, marginRight: 5 }}
                  size={34}
                  color="#2e64e5"
                />
              </View>
            </Send>
          </View>
        )}
      </View>
    );
  }, [contentRoom]);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      renderSend={renderSend}
      user={{
        _id: contentRoom.currentUserId,
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
      renderUsernameOnMessage={true}
      renderUsername={renderUsername}
    />
  );
};

export default ChatWindows;
