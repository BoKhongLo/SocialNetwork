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
const UserItem = ({ user, onPress }) => {
  const [isFriendAdded, setFriendAdded] = useState(false);
  const [isFriend, setIsFriend] = useState("Added");
  const [isPending, setPending] = useState(false);

  const handleAddFriendPress = () => {
    // Thực hiện các hành động khi nút được nhấn để thêm bạn bè
    console.log("Add Friend button pressed");
    // Gọi hàm hoặc thực hiện logic thêm bạn bè ở đây
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
        <View style={{flexDirection:'row'}}>
          <TouchableOpacity
            style={searchStyles.addButton}
            onPress={handleAddFriendPress}
          >
            <Text>Deny</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[searchStyles.addButton,{backgroundColor:'#6BB0F5'}]}
            onPress={handleAddFriendPress}
          >
            <Text style={{color:'white'}}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Divider orientation="horizontal" />
    </TouchableOpacity>
  );
};

export default UserItem;
