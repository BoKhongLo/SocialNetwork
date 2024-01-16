import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Divider } from "react-native-elements";
const UserItem = ({ user, onPress }) => {
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
          style={{
            height: 45,
            width: 45,
            borderRadius: 30,
            resizeMode: "contain",
            borderWidth: 0.3,
          }}
            source={{uri: user.detail.avatarUrl}} 
        />
          ) : (
            <Image
            style={{
              height: 45,
              width: 45,
              borderRadius: 30,
              resizeMode: "contain",
              borderWidth: 0.3,
            }}
          />
          )}

          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontWeight: "500" }}>{user.detail.name}</Text>
            {user.detail.nickName && (
              <Text style={{ color: "gray" }}>{user.detail.nickName}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity onPress={handleAddFriendPress}>
          <Image
            style={{ height: 30, width: 30 }}
            source={require("../../../assets/dummyicon/user_add_line.png")}
          />
        </TouchableOpacity>
      </View>
      <Divider orientation="horizontal" />
    </TouchableOpacity>
  );
};

export default UserItem;