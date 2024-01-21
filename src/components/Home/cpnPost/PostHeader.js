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
import { LinearGradient } from 'expo-linear-gradient';


const PostHeader = ({ post, onAvatarPress, onEllipsisPress, users, headerColor }) => {
  const { username, avt } = post;

  const handleAvatarPress = () => {
    console.log("Avatar pressed!");
    if (onAvatarPress) {
      onAvatarPress();
    }
  };
  return (
    <View style={[headerPostStyles.containerHeaderPost]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <LinearGradient
          colors={['#CA1D7E', '#E35157', '#F2703F']}
          start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
          style={{ height: 38,width: 38,alignItems: 'center',justifyContent: 'center',borderRadius:38 / 2}}
        >
          <TouchableHighlight
            style={[highLight.highLightAVTpost, {
              width: 36,height: 36,borderRadius: 36/2,alignSelf: 'center',borderColor: '#fff',borderWidth: 2
            }]}
            underlayColor="lightgray"
            onPress={handleAvatarPress}
          >
          {users[post.ownerUserId].detail.avatarUrl ? (
            <Image style={headerPostStyles.avatar} source={{uri: users[post.ownerUserId].detail.avatarUrl}} />
          ): (
            <Image style={headerPostStyles.avatar}/>
          )}

          </TouchableHighlight>
        </LinearGradient>
        <View>
          <Text style={[headerPostStyles.userName, { color: headerColor}]}>{users[post.ownerUserId].detail.name}</Text>
        </View>
      </View>
    </View>
  );
};

export default PostHeader;