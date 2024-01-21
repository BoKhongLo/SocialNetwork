import React, { useState } from "react";
import { View, Image, TouchableOpacity, Modal as RNModal, StyleSheet, FlatList } from "react-native";
import Swiper from "react-native-swiper";
import headerPostStyles from "./../../../styles/postHeaderStyles";
import { Video, Audio } from 'expo-av';

const PostImage = React.memo(({ post, users }) => {

  const [isModalVisible, setModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const validateFile = (file) => {
    const imgExt = ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "webp", "raf"];
    const videoExt = ["mp4", "avi", "mkv", "mov", "wmv", "flv", "webm"];
    const audioExt = ["mp3", "ogg", "wav", "flac", "aac", "wma", "m4a"];
    const lastElement = file.split("/").pop();
    const fileExt = lastElement
      .split("?")[0]
      .split(".")
      .pop()
      .toLowerCase();

    if (imgExt.includes(fileExt)) {
      return "IMAGE"
    } else if (audioExt.includes(fileExt)) {
      return "AUDIO"
    } else if (videoExt.includes(fileExt)) {
      return "VIDEO"
    }
  }

  const handleImagePress = (index) => {
    setCurrentImageIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => handleImagePress(index)}
      style={styles.gridItem}
    >
      {validateFile(item) === "IMAGE" ? (
        <Image
          source={{ uri: item }}
          style={styles.image}
        />
      ) : validateFile(item) === "VIDEO" ? (
        <Video
          style={styles.image}
          source={{ uri: item }}
          useNativeControls
          resizeMode="contain"
        />
      ) : (
        <Video
          style={styles.image}
          source={{ uri: item }}
          useNativeControls
          resizeMode="contain"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View>
      <View>
        <FlatList
          data={post.fileUrl}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.gridContainer}
        />
      </View>

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
            {post.fileUrl.map((image, index) => (
              <View key={index}>
                {validateFile(image) === "IMAGE" ? (
                  <Image
                    source={{ uri: image }}
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "contain",
                      backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                  />
                ) : validateFile(image) === "VIDEO" ? (
                  <Video
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "contain",
                      backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                    source={{ uri: image }}
                    useNativeControls
                    resizeMode="contain"
                  />
                ) : (
                  <Video
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "contain",
                      backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                    source={{ uri: image }}
                    useNativeControls
                    resizeMode="contain"
                  />
                )}
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
});

const styles = StyleSheet.create({
  gridContainer: {
    padding: 8,
  },
  gridItem: {
    flex: 1,
    // margin: 4,
    borderWidth: 0.2,
    borderColor: 'lightgrey',
  },
  image: {
    flex: 1,
    aspectRatio: 1,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
export default PostImage;