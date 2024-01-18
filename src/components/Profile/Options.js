import { View, Text, } from "react-native";
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
  createRoomchatAsync,
} from "../../util";
import { RoomchatDto } from "../../util/dto"
const Options = ({data}) => {
  const navigation = useNavigation();
  const [isFriendAdded, setFriendAdded] = useState(false);
  const [isFriend, setIsFriend] = useState("Added");
  const [isPending, setPending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {

      const keys = await getAllIdUserLocal();
      const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);

      const dataUserAsync = await getUserDataAsync(
        dataUserLocal.id,
        dataUserLocal.accessToken
      );
      const dataRequest = await getFriendRequestAsync(dataUserLocal.id, dataUserLocal.accessToken)
      if ("errors" in dataUserAsync) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        dataUserAsync = await getUserDataAsync(
          dataUpdate.id,
          dataUpdate.accessToken
        )
        dataRequest = await getFriendRequestAsync(dataUserLocal.id, dataUpdate.accessToken)
      }

      if ("errors" in dataUserAsync) {
        navigation.navigate("main");
      }

      if (dataUserAsync.friends.includes(data.id)) {
        setIsFriend("Friend")
        setFriendAdded(true);

      }
      else {
        for (let friends of dataRequest) {
          if (friends.createdUserId === data.id) {
            setIsFriend("Accept")
            setPending(true);
            setFriendAdded(true);
            break;
          }
        }
      }

    };

    fetchData();
  }, [data]);

  const handleAddFriendPress =  async () => {
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    const dataUpdate = await updateAccessTokenAsync(
      dataUserLocal.id,
      dataUserLocal.refreshToken
    );
    if (isFriend === "Friend" && isFriendAdded) {
      await removeFriendAsync(dataUserLocal.id, data.id, dataUpdate.accessToken)
    }
    else if (isFriend === "Accept" && isFriendAdded) {
      await acceptFriendAsync(dataUserLocal.id, data.id, dataUpdate.accessToken)
      const dto = new RoomchatDto(
        dataUserLocal.id, 
        [data.id], 
        dataUserLocal.id + data.id,
        true)
      await createRoomchatAsync(dto, dataUpdate.accessToken);
      setIsFriend("Friend");
      setPending(false)
      return;
    }
    else {
      await addFriendAsync(dataUserLocal.id, data.id, dataUpdate.accessToken)
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
    await removeFriendAsync(dataUserLocal.id, data.id, dataUpdate.accessToken)
    setFriendAdded(!isFriendAdded);
    setPending(false);
  }
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
        <Text style={profileStyle.textEdit}>
          {isFriendAdded ? isFriend : "Add Friend"}
        </Text>
      </TouchableOpacity>
      
      {isPending &&(
        <TouchableOpacity
        onPress={handleDenyFriend}
        style={[profileStyle.editContainer, { paddingHorizontal: 18,marginHorizontal: 1 }]}
      >
        <Text style={profileStyle.textEdit}>Deny</Text>
      </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[profileStyle.editContainer, { paddingHorizontal: 18,marginHorizontal: 1 }]}
      >
        <Text style={profileStyle.textEdit}>Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Options;