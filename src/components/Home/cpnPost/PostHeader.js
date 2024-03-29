import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
} from "react-native";
import highLight from "./../../../styles/highLightStyles";
import Modal from "react-native-modal";
import headerPostStyles from "./../../../styles/postHeaderStyles";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import {
  removePostAsync,
  getAllIdUserLocal,
  getDataUserLocal,
  updateAccessTokenAsync,
} from "../../../util";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const PostHeader = ({
  post,
  onAvatarPress,
  users,
  userCurrent,
  headerColor,
}) => {
  const { username, avt } = post;
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

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
  const alertDeletePost = () => {
    Alert.alert("", "Delete this post ?", [
      { text: "Cancel", onPress: () => null },
      { text: "OK", onPress: () => handleDeletePost() },
    ]);
  };

  const handleEditPost = async () => {
    navigation.navigate("newpost", { data: post });
    toggleModal();
  };

  return (
    <View style={[headerPostStyles.containerHeaderPost]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <LinearGradient
          colors={["#CA1D7E", "#E35157", "#F2703F"]}
          start={{ x: 0.0, y: 1.0 }}
          end={{ x: 1.0, y: 1.0 }}
          style={{
            height: 38,
            width: 38,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 38 / 2,
          }}
        >
          <TouchableHighlight
            style={[
              highLight.highLightAVTpost,
              {
                width: 36,
                height: 36,
                borderRadius: 36 / 2,
                alignSelf: "center",
                borderColor: "#fff",
                borderWidth: 2,
              },
            ]}
            underlayColor="lightgray"
            onPress={handleAvatarPress}
          >
            {users[post.ownerUserId] &&
            users[post.ownerUserId].detail.avatarUrl ? (
              <Image
                style={headerPostStyles.avatar}
                source={{ uri: users[post.ownerUserId].detail.avatarUrl }}
              />
            ) : (
              <Image style={headerPostStyles.avatar} 
                source={require("../../../../assets/img/avt.png")}
               />
            )}
          </TouchableHighlight>
        </LinearGradient>
        {users[post.ownerUserId] && (
          <View style={{ flex: 1 }}>
            <Text style={[headerPostStyles.userName, { color: headerColor }]}>
              {users[post.ownerUserId].detail.name}
            </Text>
          </View>
        )}
        {post.ownerUserId === userCurrent.id && (
          <View>
            <TouchableOpacity style={{ paddingHorizontal: 20,}} onPress={toggleModal}>
              {/* <MaterialCommunityIcons style={{color: "black", borderColor: "white", borderWidth: 2 }} name="dots-horizontal" size={25} /> */}
              <Image style={{width: 40, height: 20}} source={require("../../../../assets/dummyicon/more_1_line.png")}/>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {post.ownerUserId === userCurrent.id && (
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={toggleModal}
          style={{ justifyContent: "flex-end", margin: 0 }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 16,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <TouchableOpacity onPress={handleEditPost}>
              <Text
                style={{
                  color: "black",
                  fontSize: 20,
                  marginBottom: 10,
                }}
              >
                Edit post
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={alertDeletePost}>
              <Text style={{ color: "red", fontSize: 20 }}>Delete post</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

const Item = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
        alignItems: "center",
      }}
    >
      <Image
        style={{
          height: 50,
          width: 50,
          borderRadius: 30,
          backgroundColor: "black",
        }}
      />
      <View style={{ flex: 1, marginHorizontal: 10 }}>
        <Text style={{ fontSize: 18 }}>name</Text>
      </View>
      <TouchableOpacity
        style={{
          paddingHorizontal: 15,
          paddingVertical: 10,
          backgroundColor: "lightgrey",
          borderRadius: 15,
        }}
      >
        <Text style={{ fontSize: 18 }}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};
export default PostHeader;
