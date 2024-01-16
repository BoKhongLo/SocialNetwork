import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from "react-native";
import highLight from "./../../../styles/highLightStyles";
import Modal from "react-native-modal";
import headerPostStyles from "./../../../styles/postHeaderStyles";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

const PostHeader = ({ post, onAvatarPress, onEllipsisPress, users }) => {
  const { username, avt } = post;

  const handleAvatarPress = () => {
    console.log("Avatar pressed!");
    if (onAvatarPress) {
      onAvatarPress();
    }
  };
  return (
    <View style={headerPostStyles.containerHeaderPost}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableHighlight
          style={highLight.highLightAVTpost}
          underlayColor="lightgray"
          onPress={handleAvatarPress}
        >
        {users[post.ownerUserId].detail.avatarUrl ? (
          <Image style={headerPostStyles.avatar} source={{uri: users[post.ownerUserId].detail.avatarUrl}} />
        ): (
          <Image style={headerPostStyles.avatar}/>
        )}

        </TouchableHighlight>
        <View>
          <Text style={headerPostStyles.userName}>{users[post.ownerUserId].detail.name}</Text>
        </View>
      </View>
    </View>
  );
};

export default PostHeader;