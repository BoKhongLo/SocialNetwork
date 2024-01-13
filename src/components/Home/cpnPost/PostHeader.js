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

const PostHeader = ({ post, onAvatarPress, onEllipsisPress }) => {
  const { username, avt } = post[0];

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
          <Image style={headerPostStyles.avatar} source={avt} />
        </TouchableHighlight>
        <View>
          <Text style={headerPostStyles.userName}>{username}</Text>
        </View>
      </View>
    </View>
  );
};

export default PostHeader;