import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import profileStyle from "../../styles/profileStyles";
import { useNavigation } from "@react-navigation/native";

import {
  getUserDataAsync,
  getAllIdUserLocal,
  getDataUserLocal,
  updateAccessTokenAsync,
  addFriendAsync,
  removeFriendAsync,
  acceptFriendAsync,
  getFriendRequestAsync,
  getFriendReceiveAsync,
  createRoomchatAsync,
  saveDataUserLocal,
} from "../../util";
import { RoomchatDto } from "../../util/dto";
import styles from "./../../styles/styles";
import { color } from "react-native-elements/dist/helpers";
const Options = ({ data }) => {
  const navigation = useNavigation();
  const [isFriendAdded, setFriendAdded] = useState(false);
  const [isFriend, setIsFriend] = useState("Cancel request");
  const [isPending, setPending] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const [dataUser, setDataUser] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const keys = await getAllIdUserLocal();
      const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);

      let dataUserAsync = await getUserDataAsync(
        dataUserLocal.id,
        dataUserLocal.accessToken
      );
      let dataRequest = await getFriendRequestAsync(
        dataUserLocal.id,
        dataUserLocal.accessToken
      );
      let dataReceive = await getFriendReceiveAsync(
        dataUserLocal.id,
        dataUserLocal.accessToken
      );
      if ("errors" in dataUserAsync) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        await saveDataUserLocal(dataUpdate.id, dataUpdate)
        dataUserAsync = await getUserDataAsync(
          dataUpdate.id,
          dataUpdate.accessToken
        );
        dataRequest = await getFriendRequestAsync(
          dataUserLocal.id,
          dataUpdate.accessToken
        );
        dataReceive = await getFriendReceiveAsync(
          dataUserLocal.id,
          dataUserLocal.accessToken
        );
      }
      if ("errors" in dataUserAsync) {
        navigation.navigate("main");
      }
      if (dataUserAsync.friends.includes(data.id)) {
        setIsFriend("Friend");
        setFriendAdded(true);
      }
      else if (dataReceive && dataReceive.findIndex(item => item.createdUserId === data.id) !== -1) {
        setIsFriend("Accept");
        setPending(true);
        setFriendAdded(true);
      }
      else if (dataRequest && dataRequest.findIndex(item => item.receiveUserId === data.id) !== -1) {
        setIsFriend("Cancel request");
        setPending(false);
        setFriendAdded(true);
      }
      setFetching(true);
    };

    fetchData();
  }, [data]);

  const handleAddFriendPress = async () => {
    if (!isFetching) return;
    console.log(isFriend)
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    let dataUpdate = await updateAccessTokenAsync(
      dataUserLocal.id,
      dataUserLocal.refreshToken
    );
    if (isFriend === "Friend" && isFriendAdded) {
      let dataRe = await removeFriendAsync(
        dataUserLocal.id,
        data.id,
        dataUpdate.accessToken
      );
      if ("errors" in dataRe) {
        dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        dataRe = await removeFriendAsync(
          dataUserLocal.id,
          data.id,
          dataUpdate.accessToken
        );
      }
      if ("errors" in dataRe) return;
    } else if (isFriend === "Accept" && isFriendAdded) {
      let dataRe = await acceptFriendAsync(
        dataUserLocal.id,
        data.id,
        dataUpdate.accessToken
      );
      if ("errors" in dataRe) {
        dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        dataRe = await acceptFriendAsync(
          dataUserLocal.id,
          data.id,
          dataUpdate.accessToken
        );
      }
      if ("errors" in dataRe) return;
      const dto = new RoomchatDto(
        dataUserLocal.id,
        [data.id],
        dataUserLocal.id + data.id,
        true
      );
      await createRoomchatAsync(dto, dataUpdate.accessToken);
      setIsFriend("Friend");
      setPending(false);
      return;
    } 
    else if (isFriend === "Cancel request" && isFriendAdded) {
      let dataRe = await removeFriendAsync(
        dataUserLocal.id,
        data.id,
        dataUpdate.accessToken
      );
      console.log(dataRe)
      if ("errors" in dataRe) {
        dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        dataRe = await removeFriendAsync(
          dataUserLocal.id,
          data.id,
          dataUpdate.accessToken
        );
      }
      if ("errors" in dataRe) return;
    }
    else {
      let dataRe = await addFriendAsync(dataUserLocal.id, data.id, dataUpdate.accessToken);
      if ("errors" in dataRe) {
        dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        dataRe = await addFriendAsync(dataUserLocal.id, data.id, dataUpdate.accessToken);
      }
      if ("errors" in dataRe) return;
    }
    setFriendAdded(!isFriendAdded);
  };

  const handleDenyFriend = async () => {
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    let dataUpdate = await updateAccessTokenAsync(
      dataUserLocal.id,
      dataUserLocal.refreshToken
    );
    let dataRe = await removeFriendAsync(dataUserLocal.id, data.id, dataUpdate.accessToken);
    if ("errors" in dataRe) {
      dataUpdate = await updateAccessTokenAsync(
        dataUserLocal.id,
        dataUserLocal.refreshToken
      );
      dataRe = await removeFriendAsync(dataUserLocal.id, data.id, dataUpdate.accessToken);
    }
    if ("errors" in dataRe) return;
    setFriendAdded(!isFriendAdded);
    setPending(false);
  };

  const handleChat = async () => {
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    const dataUpdate = await updateAccessTokenAsync(
      dataUserLocal.id,
      dataUserLocal.refreshToken
    );
    const dto = new RoomchatDto(
      dataUserLocal.id,
      [data.id],
      dataUserLocal.id + data.id,
      true
    );
    let dataRoomchatAsync = await createRoomchatAsync(
      dto,
      dataUpdate.accessToken
    );
    dataRoomchatAsync.imgDisplay = data.avatarUrl;
    dataRoomchatAsync.title = data.username;
    navigation.replace("chatwindow", { data: dataRoomchatAsync });
  };
  return (
    <View>
      {isFetching && (
        <View
          style={{
            flexDirection: "row",
            marginVertical: 10,

            paddingBottom: 15,
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={[
              profileStyle.editContainer,
              isFriendAdded ? { backgroundColor: "#1E90FF" } : null,
              { marginHorizontal: 1 },
            ]}
            onPress={handleAddFriendPress}
          >
            <Text style={[
              profileStyle.textEdit,
              isFriendAdded ? { backgroundColor: "#1E90FF",color:'white',borderRadius:10 } : null,
            ]}>
              {isFriendAdded ? isFriend : "Add Friend"}
            </Text>
          </TouchableOpacity>

          {isPending && (
            <TouchableOpacity
              onPress={handleDenyFriend}
              style={[
                profileStyle.editContainer,
                { paddingHorizontal: 18, marginHorizontal: 1 },
              ]}
            >
              <Text style={profileStyle.textEdit}>Deny</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleChat}
            style={[
              profileStyle.editContainer,
              { paddingHorizontal: 18, marginHorizontal: 1 },
            ]}
          >
            <Text style={profileStyle.textEdit}>Chat</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Options;
