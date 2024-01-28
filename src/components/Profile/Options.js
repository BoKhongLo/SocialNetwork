import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import profileStyle from "../../styles/profileStyles";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

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
      else if (dataReceive.findIndex(item => item.createdUserId === data.id) !== -1) {
        setIsFriend("Accept");
        setPending(true);
        setFriendAdded(true);
      }
      else if (dataRequest.findIndex(item => item.receiveUserId === data.id) !== -1) {
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
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    const dataUpdate = await updateAccessTokenAsync(
      dataUserLocal.id,
      dataUserLocal.refreshToken
    );
    if (isFriend === "Friend" && isFriendAdded) {
      await removeFriendAsync(
        dataUserLocal.id,
        data.id,
        dataUpdate.accessToken
      );
    } else if (isFriend === "Accept" && isFriendAdded) {
      await acceptFriendAsync(
        dataUserLocal.id,
        data.id,
        dataUpdate.accessToken
      );
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
    } else {
      await addFriendAsync(dataUserLocal.id, data.id, dataUpdate.accessToken);
    }
    setFriendAdded(!isFriendAdded);
  };

  const handleDenyFriend = async () => {
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    const dataUpdate = await updateAccessTokenAsync(
      dataUserLocal.id,
      dataUserLocal.refreshToken
    );
    await removeFriendAsync(dataUserLocal.id, data.id, dataUpdate.accessToken);
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
    dataRoomchatAsync.title = data.name;
    navigation.replace("chatwindow", { data: dataRoomchatAsync });
  };
  return (
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
          isFriendAdded ? { backgroundColor: "#1E90FF" } : null,
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
  );
};

export default Options;
