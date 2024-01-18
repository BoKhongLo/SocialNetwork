// Trong component LoadStories.js
import React, { useState,useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import styles from "../../styles/styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAllIdUserLocal, getDataUserLocal, updateAccessTokenAsync, getSocketIO, getRoomchatByTitleAsync,  } from "../../util";
const LoadStories = () => {
  const route = useRoute();
  const [receivedData, setReceivedData] = useState(route.params?.data || null);
  const [imageHeight, setImageHeight] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        justifyContent: "space-between",
        flex: 1,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("main")}
          style={{ marginLeft: 10 }}
        >
          <Image
            style={styles.iconforAll}
            source={require("../../../assets/dummyicon/left_line_64.png")}
          />
        </TouchableOpacity>
      </View>
      <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: 'auto',
        marginBottom: 50,
        marginTop: 50,
        flex:1
      }}
    >
      <Image
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'contain',
          alignItems: 'center',
        }}
        source={{uri: receivedData.post.fileUrl[0]}}
      />
    </View>


      <Comments data={receivedData.post} users={receivedData.users}/>
    </View>
  );
};

const Comments = ({data, users}) => {
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
      const dataUserLocal = {...dataLocal};

      let dataRoomchatAsync = await getRoomchatByTitleAsync(
        dataUserLocal.id + data.ownerUserId,
        dataUserLocal.accessToken
      );

      if ("errors" in dataRoomchatAsync && dataRoomchatAsync.errors[0].message !== "This roomchat does not exist") {
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
      if ("errors" in dataRoomchatAsync && dataRoomchatAsync.errors[0].message === "This roomchat does not exist") {
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

  const handleSend = async() => {
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
    navigation.navigate('chatwindow', { data: dataRoomchat });
    setText("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ flex: 0.1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ flex: 1, justifyContent: "center" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 8, marginLeft: 10 }}>
            <TextInput
              keyboardType="default"
              placeholder="Gửi tin nhắn"
              style={{
                borderRadius: 20,
                borderWidth: 1,
                height: hp("5%"),
                textAlign: "center",
              }}
              onChangeText={handleInputChange}
              value={text}
            />
          </View>
          <View
            style={{
              flex: 3,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity onPress={handleSend}>
              <Image
                style={styles.iconforAll}
                source={require("../../../assets/dummyicon/share.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
export default LoadStories;
