// Trong component LoadStories.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "../../styles/styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Video, Audio } from "expo-av";
import {
  getAllIdUserLocal,
  getDataUserLocal,
  updateAccessTokenAsync,
  getSocketIO,
  getRoomchatByTitleAsync,
  removePostAsync,
} from "../../util";
const LoadStories = () => {
  const route = useRoute();
  const receivedData = route.params?.data;

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useEffect(() => {
    if (!receivedData) navigation.navigate("main");
    console.log(receivedData);
  }, []);
  const validateFile = (file) => {
    if (!file || file == "") return "Null";
    const imgExt = ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "webp", "raf"];
    const videoExt = ["mp4", "avi", "mkv", "mov", "wmv", "flv", "webm"];
    const audioExt = ["mp3", "ogg", "wav", "flac", "aac", "wma", "m4a"];
    const lastElement = file.split("/").pop();
    const fileExt = lastElement.split("?")[0].split(".").pop().toLowerCase();

    if (imgExt.includes(fileExt)) {
      return "IMAGE";
    } else if (audioExt.includes(fileExt)) {
      return "AUDIO";
    } else if (videoExt.includes(fileExt)) {
      return "VIDEO";
    }
  };
  const handleDeletePost = async () => {
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    let dataReturn = await removePostAsync(
      dataUserLocal.id,
      receivedData.post.id,
      dataUserLocal.accessToken
    );

    if ("errors" in dataReturn) {
      const dataUpdate = await updateAccessTokenAsync(
        dataUserLocal.id,
        dataUserLocal.refreshToken
      );
      dataReturn = await removePostAsync(
        dataUserLocal.id,
        receivedData.post.id,
        dataUpdate.accessToken
      );
    }

    if ("errors" in dataReturn) return;
    navigation.replace("main");
  };

  const alertDeleteStory = () => {
    Alert.alert("", "Delete this story ?", [
      { text: "Cancel", onPress: () => null },
      { text: "OK", onPress: () => handleDeletePost() },
    ]);
  };
  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        flex: 1,
        backgroundColor: "#111111",
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 10 }}
        >
          <Image
            style={styles.iconforAll}
            source={require("../../../assets/dummyicon/left_fill.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => alertDeleteStory()}
          style={{ marginLeft: 10 }}
        >
          <Image
            style={styles.iconforAll}
            source={require("../../../assets/dummyicon/more_1_line.png")}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "auto",
          flex: 1,
        }}
      >
        {receivedData &&
        validateFile(receivedData.post.fileUrl[0]) === "IMAGE" ? (
          <Image
            source={{ uri: receivedData.post.fileUrl[0] }}
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "contain",
              alignItems: "center",
            }}
          />
        ) : receivedData &&
          validateFile(receivedData.post.fileUrl[0]) === "VIDEO" ? (
          <Video
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "contain",
              alignItems: "center",
            }}
            source={{ uri: receivedData.post.fileUrl[0] }}
            useNativeControls
            resizeMode="contain"
          />
        ) : (
          <Video
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "contain",
              alignItems: "center",
            }}
            source={{ uri: receivedData.post.fileUrl[0] }}
            useNativeControls
            resizeMode="contain"
          />
        )}
      </View>

      <Comments data={receivedData.post} users={receivedData.users} />
    </View>
  );
};

const Comments = ({ data, users }) => {
  const [text, setText] = useState("");
  const navigation = useNavigation();
  const handleInputChange = (inputText) => {
    setText(inputText);
  };
  const [dataRoomchat, setDataRoomchat] = useState(null);
  const [socket, setSocket] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const keys = await getAllIdUserLocal();
      const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
      const dataUserLocal = { ...dataLocal };

      let dataRoomchatAsync = await getRoomchatByTitleAsync(
        dataUserLocal.id + data.ownerUserId,
        dataUserLocal.accessToken
      );

      if (
        "errors" in dataRoomchatAsync &&
        dataRoomchatAsync.errors[0].message !== "This roomchat does not exist"
      ) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        dataUserLocal.accessToken = dataUpdate.accessToken;
        dataRoomchatAsync = await getRoomchatByTitleAsync(
          dataUserLocal.id + data.ownerUserId,
          dataUpdate.accessToken
        );
      }
      if (
        "errors" in dataRoomchatAsync &&
        dataRoomchatAsync.errors[0].message === "This roomchat does not exist"
      ) {
        dataRoomchatAsync = await getRoomchatByTitleAsync(
          data.ownerUserId + dataUserLocal.id,
          dataUserLocal.accessToken
        );
      }
      if ("errors" in dataRoomchatAsync) {
        return;
      }
      dataRoomchatAsync.imgDisplay = users[data.ownerUserId].detail.avatarUrl;
      dataRoomchatAsync.title = users[data.ownerUserId].detail.name;
      const newSocket = await getSocketIO(dataUserLocal.accessToken);
      setSocket(newSocket);
      setDataRoomchat(dataRoomchatAsync);
    };

    fetchData();
    return () => {
      if (socket != undefined) {
        socket.disconnect();
      }
    };
  }, []);

  const handleSend = async () => {
    if (socket == undefined) return;
    if (dataRoomchat == null) return;
    const keys = await getAllIdUserLocal();
    const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
    socket.emit("sendMessage", {
      userId: dataLocal.id,
      content: text,
      fileUrl: [data.fileUrl[0]],
      roomchatId: dataRoomchat.id,
    });
    navigation.replace("chatwindow", { data: dataRoomchat });
    setText("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ flex: 0.1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ flex: 1, justifyContent: "center",margin:5}}>
        
          <View
            style={{
              flex: 7,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "white",
              backgroundColor: "white",
              flexDirection: "row",
            justifyContent: "space-between",
            }}
          >
            <TextInput
              keyboardType="default"
              placeholder="Gửi tin nhắn"
              style={{
                textAlign: "center",
                flex:1
              }}
              onChangeText={handleInputChange}
              value={text}
            />
            <TouchableOpacity
            onPress={handleSend}
            style={{justifyContent:'center',padding:10}}
          >
            <Image
              style={styles.iconforAll}
              source={require("../../../assets/dummyicon/share.png")}
            />
          </TouchableOpacity>
          </View>

          
        </View>

    </KeyboardAvoidingView>
  );
};
export default LoadStories;
