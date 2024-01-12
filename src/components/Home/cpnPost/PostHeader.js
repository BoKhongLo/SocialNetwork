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
import headerPostStyles from './../../../styles/postHeaderStyles';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

const PostHeader = ({ post, onAvatarPress, onEllipsisPress }) => {
  const { username, avt } = post[0];
  const [isModalVisible, setModalVisible] = useState(false);

  const handleAvatarPress = () => {
    console.log("Avatar pressed!");
    if (onAvatarPress) {
      onAvatarPress();
    }
  };

  const handleEllipsisPress = () => {
    console.log("3Dots pressed!");
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
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

      <View>
        <TouchableWithoutFeedback onPress={handleEllipsisPress}>
          <Image
            style={{ width: 30, height: 30 }}
            source={require("../../../../assets/dummyicon/more_1_line.png")}
          />
        </TouchableWithoutFeedback>
      </View>

      <Modal
        isVisible={isModalVisible}
        style={{ margin: 0, justifyContent: "flex-end" }}
        onBackdropPress={closeModal}
      >
        <View
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            justifyContent: "space-between",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: heightPercentageToDP("30%"),
          }}
        >
          <Text>This is your modal content</Text>
        </View>
      </Modal>
    </View>
  );
};

export default PostHeader;
