import React, { useState } from "react";
import { View, Image, TouchableOpacity, Modal as RNModal, StyleSheet, FlatList } from "react-native";
import Swiper from "react-native-swiper";
import headerPostStyles from "./../../../styles/postHeaderStyles";

const PostImage = ({ post, users }) => {

  const [isModalVisible, setModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
      <Image style={styles.image} source={{ uri: item }} />
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
                <Image
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "contain",
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }}
                  source={{ uri: image }}
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

const styles = StyleSheet.create({
  gridContainer: {
    padding: 8,
  },
  gridItem: {
    flex: 1,
    margin: 4,
    borderWidth: 0.2,
    borderColor: 'lightgrey',
  },
  image: {
    flex: 1,
    aspectRatio: 1,
    resizeMode: 'cover',
  },
});
export default PostImage;