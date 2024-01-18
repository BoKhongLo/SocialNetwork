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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const PostHeader = ({ post, onAvatarPress, onEllipsisPress, users }) => {
  const { username, avt } = post;

  const [isModalVisible, setModalVisible] = useState(false);

  const handleAvatarPress = () => {
    console.log("Avatar pressed!");
    if (onAvatarPress) {
      onAvatarPress();
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleDeletePost = () => {
    // Đặt logic xóa bài post ở đây
    console.log("Bài post đã bị xóa!");
    // Sau khi xóa xong, đóng modal
    toggleModal();
  };

  return (
    <View style={headerPostStyles.containerHeaderPost}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <TouchableHighlight
          style={highLight.highLightAVTpost}
          underlayColor="lightgray"
          onPress={handleAvatarPress}
        >
          {users[post.ownerUserId].detail.avatarUrl ? (
            <Image
              style={headerPostStyles.avatar}
              source={{ uri: users[post.ownerUserId].detail.avatarUrl }}
            />
          ) : (
            <Image style={headerPostStyles.avatar} />
          )}
        </TouchableHighlight>
        <View style={{ flex: 3 }}>
          <Text style={headerPostStyles.userName}>
            {users[post.ownerUserId].detail.name}
          </Text>
        </View>
        <TouchableOpacity style={{ paddingHorizontal: 20 }} onPress={toggleModal}>
          <MaterialCommunityIcons name="dots-horizontal" size={25} />
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        <View style={{ backgroundColor: 'white', padding: 16, height: 70 }}>
          <TouchableOpacity onPress={handleDeletePost}>
            <Text style={{ color: 'red', textAlign: 'center', fontSize: 20 }}>
              Delete post
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default PostHeader;