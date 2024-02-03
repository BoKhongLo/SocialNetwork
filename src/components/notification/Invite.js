import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import React, { useEffect, useState } from "react";
import cpnNotiStyles from "../../styles/NotiStyle/notiStyles";
import {
  getAllIdUserLocal,
  getDataUserLocal,
  updateAccessTokenAsync,
  getUserDataAsync,
  getFriendReceiveAsync,
  getUserDataLiteAsync,
  acceptFriendAsync,
  removeFriendAsync,
  createRoomchatAsync
} from "../../util";
import {
  RoomchatDto
} from "../../util/dto";
import { useNavigation } from "@react-navigation/native";
const Invite = () => {
  const [dataInvite, setDataInvite] = useState([])
  const [dataUser, setDataUser] = useState({})

  const handleRemoveInvite = (id) => {
    setDataInvite(item => item.filter(req => req.id !== id))
  }

  function removeDuplicates(array, key) {
    return array.filter((item, index, self) =>
        index === self.findIndex((t) => (
            t[key] === item[key]
        ))
    );
  }
  useEffect(() => {
    const fetchData = async () => {
      const keys = await getAllIdUserLocal();
      const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
      let dataUserLocal = { ...dataLocal }
      let dataRequest = await getFriendReceiveAsync(
        dataUserLocal.id,
        dataUserLocal.accessToken
      );
      if ("errors" in dataRequest) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        dataUserLocal.accessToken = dataUpdate.accessToken;
        dataRequest = await getFriendReceiveAsync(dataUserLocal.id, dataUpdate.accessToken);
      }
      if ("errors" in dataRequest) return;
      dataRequest = removeDuplicates(dataRequest, 'id');
      const tmpDataUser = {};
      for (let item of dataRequest) {
        if (item.createdUserId in tmpDataUser) continue;
        let tmpData = await getUserDataLiteAsync(item.createdUserId, dataUserLocal.accessToken);
        tmpDataUser[tmpData.id] = tmpData;
        if (item.receiveUserId in tmpDataUser) continue;
        tmpData = await getUserDataLiteAsync(item.receiveUserId, dataUserLocal.accessToken);
        tmpDataUser[tmpData.id] = tmpData;
      }
      setDataUser(tmpDataUser)
      setDataInvite(dataRequest)
    }
    fetchData()
  }, [])
  return (
    <View style={cpnNotiStyles.container}>
      {dataInvite.length !== 0 && (
        <Text style={cpnNotiStyles.title}>Friend invite</Text>
      )}
      <FlatList
        data={dataInvite}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Item data={item} users={dataUser} removeRq={handleRemoveInvite} />}
      />
    </View>
  );
};

const Item = ({ data, users, removeRq }) => {
  const navigation = useNavigation();

  const handleAccept = async (friendId, requestId) => {
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    const dataUpdate = await updateAccessTokenAsync(
      dataUserLocal.id,
      dataUserLocal.refreshToken
    );

    const dataRe2 = await acceptFriendAsync(dataUserLocal.id, friendId, dataUpdate.accessToken)
    console.log(dataRe2);
    const dto = new RoomchatDto(
      dataUserLocal.id,
      [friendId],
      dataUserLocal.id + friendId,
      true)
    const dataRe = await createRoomchatAsync(dto, dataUpdate.accessToken);
    console.log(dataRe);
    removeRq(requestId)
  }

  const handleDeny = async (friendId, requestId) => {
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    const dataUpdate = await updateAccessTokenAsync(
      dataUserLocal.id,
      dataUserLocal.refreshToken
    );
    await removeFriendAsync(dataUserLocal.id, friendId, dataUpdate.accessToken)
    removeRq(requestId)
  }
  const handleUserPress = async (userId) => {
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    const receivedData = { ...dataUserLocal };
    receivedData.id = userId;
    navigation.replace("Profile", { data: receivedData });
  };

  return (
    <TouchableOpacity style={cpnNotiStyles.itemContainer}
     onPress={() => handleUserPress(data.createdUserId)}
    >

      <View style={{ flex: 1, marginRight: 5 }}>
        {users[data.createdUserId].detail.avatarUrl ? (
          <Image style={cpnNotiStyles.avt} source={{ uri: users[data.createdUserId].detail.avatarUrl }} />
        ) : (
          <Image style={cpnNotiStyles.avt} />
        )}

      </View>
      <View
        style={{
          justifyContent: "center",
          flex: 2,
          marginRight: 5,
        }}
      >
        <Text style={cpnNotiStyles.name}>{users[data.createdUserId].detail.name}</Text>
        {users[data.createdUserId].detail.nickname && (
          <Text style={cpnNotiStyles.nickname}>{users[data.createdUserId].detail.nickname}</Text>
        )}

      </View>
      <View style={{ flex: 2, marginLeft: 5, flexDirection: "row" }}>
        <TouchableOpacity style={cpnNotiStyles.button}
          onPress={async () => await handleAccept(data.createdUserId, data.id)}
        >
          <Text style={cpnNotiStyles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={cpnNotiStyles.button}
          onPress={async () => await handleDeny(data.createdUserId, data.id)}
        >
          <Text style={cpnNotiStyles.buttonText}>Deny</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default Invite;
