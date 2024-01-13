import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import headerPostStyles from "./../../../styles/postHeaderStyles";
import Modal from "react-native-modal";
import Swiper from "react-native-swiper";

const PostImage = ({ post }) => {
  const { imagepost } = post[0];
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImagePress = () => {
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
    setCurrentImageIndex(0); // Reset the current image index when the modal is dismissed
  };

  return (
    <View>
      <TouchableOpacity
        onPress={handleImagePress}
        style={{ borderWidth: 0.2, borderColor: "lightgrey" }}
      >
        <Image style={headerPostStyles.image} source={imagepost[1]} />
      </TouchableOpacity>

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
        <Swiper
          loop={false}
          index={currentImageIndex}
          onIndexChanged={(index) => setCurrentImageIndex(index)}
        activeDotStyle={{ backgroundColor: 'white', width: 8, height: 8 }}
        >
          {Object.values(imagepost).map((image, index) => (
            <View key={index}>
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "contain",
                }}
                source={{ uri: image.uri }}
              />
            </View>
          ))}
        </Swiper>

        <TouchableOpacity
          onPress={closeModal}
          style={{ position: "absolute", top: 20, left: 20 }}
        >
          <Image
            style={{ height: 40, width: 40 }}
            source={require("../../../../assets/dummyicon/close_line_white.png")}
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default PostImage;