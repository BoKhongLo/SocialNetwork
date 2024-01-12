import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  ImageBackground,
} from "react-native";
import headerPostStyles from './../../../styles/postHeaderStyles';
import Modal from "react-native-modal";
const PostImage = ({ post }) => {
  const { imagepost } = post[0];
  const [isModalVisible, setModalVisible] = useState(false);


  const handleImagePress = () => {
    console.log("Image pressed!");
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const onModalShow = () => {
    console.log("Modal is shown!");
  };

  const onModalDismiss = () => {
    console.log("Modal is dismissed!");
  };

  return (
    <View>
      <TouchableHighlight
        underlayColor="lightgrey"
        onPress={handleImagePress}
        style={{ borderWidth: 0.2, borderColor: "lightgrey" }}
      >
        <Image style={headerPostStyles.image} source={imagepost} />
      </TouchableHighlight>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
        onShow={onModalShow}
        onDismiss={onModalDismiss}
        backdropOpacity={0.8}
        animationType="none"
        style={{
          margin: 0,
          justifyContent: "center",
          flex: 1,
        }}
      >
        <View>
          <TouchableOpacity
            onPress={closeModal}
            style={{ height: 30, width: 30 }}
          >
            <Image
              style={{ height: 40, width: 40 }}
              source={require("../../../../assets/dummyicon/close_line_white.png")}
            />
          </TouchableOpacity>

          <Image
            style={{
              width: "100%",
              height: "95%",
              resizeMode: "contain",
            }}
            source={imagepost}
          />
        </View>
      </Modal>
    </View>
  );
};

export default PostImage;
