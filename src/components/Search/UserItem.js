import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Divider } from "react-native-elements";
import searchStyles from "../../styles/searchScreen";
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
import { RoomchatDto } from "../../util/dto";

const UserItem = ({ user, onPress, userCurrent, friendRequest, friendReceive, updateData }) => {
  const [isUser, setIsUser] = useState(true);
  const [isFriendAdded, setFriendAdded] = useState(false);
  const [isFriend, setIsFriend] = useState("Cancel request");
  const [isPending, setPending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user.id !== userCurrent.id) {
        setIsUser(false);
      }
      if (userCurrent.friends.includes(user.id)) {
        setIsFriend("Friend");
        setFriendAdded(true);
      }
      else if (friendReceive && friendReceive.findIndex(item => item.createdUserId === user.id) !== -1) {
        setIsFriend("Accept");
        setPending(true);
        setFriendAdded(true);
      }
      else if (friendRequest && friendRequest.findIndex(item => item.receiveUserId === user.id) !== -1) {
        setIsFriend("Cancel request");
        setPending(false);
        setFriendAdded(true);
      }
    };
    fetchData();
  }, [userCurrent, friendRequest, friendReceive]);

  const handleAddFriend = async (friendId) => {
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    const dataUpdate = await updateAccessTokenAsync(
      dataUserLocal.id,
      dataUserLocal.refreshToken
    );
    if (isFriend === "Friend" && isFriendAdded) {
      const dataRe = await removeFriendAsync(
        dataUserLocal.id,
        friendId,
        dataUpdate.accessToken
      );
      if ("errors" in dataRe) return;
      updateData(friendId, "REMOVEFRIEND")
    } else if (isFriend === "Accept" && isFriendAdded) {
      const dataRe = await acceptFriendAsync(
        dataUserLocal.id,
        friendId,
        dataUpdate.accessToken
      );
      if ("errors" in dataRe) return;
      updateData(friendId, "ACCEPTFRIEND")
      const dto = new RoomchatDto(
        dataUserLocal.id,
        [friendId],
        dataUserLocal.id + friendId,
        true
      );
      await createRoomchatAsync(dto, dataUpdate.accessToken);
      setIsFriend("Friend");
      setPending(false);
      return;
    } else {
      const dataRe = await addFriendAsync(dataUserLocal.id, friendId, dataUpdate.accessToken);
      if ("errors" in dataRe) return;
      updateData(dataRe, "ADDFRIEND")
    }
    setFriendAdded(!isFriendAdded);
  };

  const handleDenyFriend = async (friendId) => {
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    const dataUpdate = await updateAccessTokenAsync(
      dataUserLocal.id,
      dataUserLocal.refreshToken
    );
    const dataRe = await removeFriendAsync(dataUserLocal.id, friendId, dataUpdate.accessToken);
    if ("errors" in dataRe) return;
    updateData(friendId, "REMOVEFRIEND")
    setFriendAdded(!isFriendAdded);
    setPending(false);
  };

  return (
    <TouchableOpacity onPress={async () => await onPress(user)}>
      <View
        style={{
          borderBottomColor: "gray",
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 10,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          {user.detail.avatarUrl ? (
            <Image
              style={searchStyles.avt}
              source={{ uri: user.detail.avatarUrl }}
            />
          ) : (
            <Image
              style={searchStyles.avt}
              source={require("../../../assets/img/avt.png")}
            />
          )}

          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontWeight: "500" }}>{user.detail.name}</Text>
            {user.detail.nickName && (
              <Text style={{ color: "gray" }}>{user.detail.nickName}</Text>
            )}
          </View>
        </View>
        {isUser === false && (
          <View style={{ flexDirection: 'row' }}>
            {isPending && (
              <TouchableOpacity
                style={searchStyles.addButton}
                onPress={async () => await handleDenyFriend(user.id)}
              >
                <Text>Deny</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[searchStyles.addButton, { backgroundColor: '#6BB0F5' }]}
              onPress={async () => await handleAddFriend(user.id)}
            >
              <Text style={{ color: 'white' }}>{isFriendAdded ? isFriend : "Add Friend"}</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
      <Divider orientation="horizontal" />
    </TouchableOpacity>
  );
};

export default UserItem;
