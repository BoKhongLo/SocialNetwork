import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import {
  getAllIdUserLocal,
  getDataUserLocal,
  updateAccessTokenAsync,
  getUserDataAsync,
  getUserDataLiteAsync,
} from "../../util";
import { useNavigation } from "@react-navigation/native";
import cpnNotiStyles from "../../styles/NotiStyle/notiStyles";
const Notify = () => {
  const [dataUserCurrent, setDataUserCurrent] = useState({});
  const [dataUser, setDataUser] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const keys = await getAllIdUserLocal();
      const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
      let dataUserLocal = { ...dataLocal };
      let dataRequest = await getUserDataAsync(
        dataUserLocal.id,
        dataUserLocal.accessToken
      );
      if ("errors" in dataRequest) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        dataUserLocal.accessToken = dataUpdate.accessToken;
        dataRequest = await getUserDataAsync(
          dataUserLocal.id,
          dataUpdate.accessToken
        );
      }
      if ("errors" in dataRequest) return;
      setDataUserCurrent(dataRequest);
      console.log(dataRequest.notification);
      const tmpDataUser = [];
      for (let item of dataRequest.notification) {
        if (item.content.userDtoId in tmpDataUser) continue;
        let tmpData = await getUserDataLiteAsync(
          item.content.userDtoId,
          dataUserLocal.accessToken
        );
        tmpData["roomId"] = item.content.roomId;
        tmpData["type"] = item.type;
        tmpDataUser.push(tmpData);
      }
      setDataUser(tmpDataUser);
    };
    fetchData();
  }, []);

  return (
    <View>
      <Text style={{ marginBottom: 10, fontSize: 20 }}>News</Text>
      <FlatList
        data={dataUser}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Item data={item} />}
      />
    </View>
  );
};
const Item = ({ data }) => {
  const navigation = useNavigation();

  const handlePress = async (postId) => {
    navigation.replace("listPost", { data: { postId: postId, dto: "noti" } });
    navigation.replace("loadStory", { data: { post: item, users: users } });
  };

  return (
    <TouchableOpacity
      style={cpnNotiStyles.itemContainer}
      onPress={() => handlePress(data.roomId)}
    >
      <View style={{ flex: 1, marginRight: 5 }}>
        {data.detail.avatarUrl ? (
          <Image
            style={cpnNotiStyles.avt}
            source={{ uri: data.detail.avatarUrl }}
          />
        ) : (
          <Image
            style={cpnNotiStyles.avt}
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/testgame-d8af2.appspot.com/o/avt.png?alt=media&token=b8108af6-1f90-4512-91f5-45091ca7351f",
            }}
          />
        )}
      </View>
      <View
        style={{
          justifyContent: "center",
          flex: 4,
        }}
      >
        {data.type === "NEWPOST" ? (
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text style={cpnNotiStyles.name}>{`${data.detail.name}`}</Text>
            <Text> vừa đăng một bài</Text>
          </View>
        ) : data.type === "NEWINTERACTION" ? (
          <Text style={cpnNotiStyles.name}>
            {data.detail.name} vừa thích bài đăng của bạn
          </Text>
        ) : (
          data.type === "NEWCOMMENT" && (
            <Text style={cpnNotiStyles.name}>
              {data.detail.name} vừa bình luận bài đăng của bạn
            </Text>
          )
        )}
      </View>
    </TouchableOpacity>
  );
};
export default Notify;
