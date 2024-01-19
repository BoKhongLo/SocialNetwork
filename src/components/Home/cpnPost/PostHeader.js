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
import {removePostAsync, getAllIdUserLocal, getDataUserLocal, updateAccessTokenAsync} from "../../../util"
import { useNavigation } from "@react-navigation/native";
const PostHeader = ({ post, onAvatarPress, onEllipsisPress, users }) => {
  const { username, avt } = post;
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isUser, setIsUser] = useState(false);

  useEffect (() => {
    const fetData = async() => {
      const keys = await getAllIdUserLocal();
      const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
      if (dataUserLocal.id === post.ownerUserId) {
        setIsUser(true);
      }
    };
    fetData()
  }, [])

  const handleAvatarPress = async () => {
    if (onAvatarPress) {
      onAvatarPress();
    }
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    const receivedData = { ...dataUserLocal };
    receivedData.id = post.ownerUserId;
    navigation.navigate("Profile", { data: receivedData });
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleDeletePost = async () => {
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    let dataReturn = await removePostAsync(
      dataUserLocal.id,
      post.id,
      dataUserLocal.accessToken
    );

    if ("errors" in dataReturn) {
      const dataUpdate = await updateAccessTokenAsync(
        dataUserLocal.id,
        dataUserLocal.refreshToken
      );
      dataReturn = await removePostAsync(
        dataUserLocal.id,
        post.id,
        dataUpdate.accessToken
      );
    }

    if ("errors" in dataReturn) return;

    toggleModal();
  };

  const handleEditPost = async () => {
    navigation.navigate("newpost", {data: post})
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
        {isUser && (
          <TouchableOpacity style={{ paddingHorizontal: 20 }} onPress={toggleModal}>
            <MaterialCommunityIcons name="dots-horizontal" size={25} />
          </TouchableOpacity>
        )}
      </View>

      {isUser && (
        <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        <View style={{ backgroundColor: 'white', padding: 16, height: 100 }}>
        <TouchableOpacity onPress={handleEditPost}>
            <Text style={{ color: 'black', textAlign: 'center', fontSize: 20, marginBottom:10 }}>
              Edit post
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeletePost}>
            <Text style={{ color: 'red', textAlign: 'center', fontSize: 20,  }}>
              Delete post
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      )}
    </View>
  );
};

export default PostHeader;