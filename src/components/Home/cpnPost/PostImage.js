import React, { useState } from "react";
import { View, Image, TouchableOpacity, Modal as RNModal } from "react-native";
import Swiper from "react-native-swiper";
import headerPostStyles from "./../../../styles/postHeaderStyles";

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

  return (
    <View>
      <TouchableOpacity
        onPress={handleImagePress}
        style={{ borderWidth: 0.2, borderColor: "lightgrey" }}
      >
        <Image style={headerPostStyles.image} source={imagepost[1]} />
      </TouchableOpacity>

      <RNModal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
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
                    backgroundColor: 'rgba(0,0,0,0.5)',
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
        </View>
      </RNModal>
    </View>
  );
};

export default PostImage;
