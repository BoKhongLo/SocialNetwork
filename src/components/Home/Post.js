import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import headerPostStyles from "../../styles/postHeaderStyles";
import Modal from "react-native-modal";

import PostHeader from "./cpnPost/PostHeader";
import PostFooter from "./cpnPost/PostFooter";
import PostImage from "./cpnPost/PostImage";
import profileStyle from "../../styles/profileStyles";

import { Divider } from "react-native-elements";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

import {
  getUserDataAsync,
  getAllIdUserLocal,
  getDataUserLocal,
  updateAccessTokenAsync,
  findFriendAsync,
  getSocketIO,
} from "../../util";
import { useNavigation } from "@react-navigation/native";
const Post = React.memo(({ post, users, userCurrent, onRemovePost }) => {
  const [countLike, setCountLike] = useState(post.interaction.length);
  const [dataUsers, setDataUsers] = useState(users);
  const [dataPost, setDataPost] = useState(post);
  const [dataUserCurrent, setDataUsersCurrent] = useState(userCurrent);

  useEffect(() => {
    const socketConnect = async () => {
      const keys = await getAllIdUserLocal();
      const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
      let dataUpdate = await updateAccessTokenAsync(
        dataUserLocal.id,
        dataUserLocal.refreshToken
      );

      const newSocket = await getSocketIO(dataUpdate.accessToken);
      console.log("Connect like");

      newSocket.on("removePost", (post) => {
        if (post.postId !== dataPost.id) return;
        onRemovePost(dataPost.id);
      });

      newSocket.on("addInteractionPost!", async (post) => {
        if (post.postId !== dataPost.id) return;
        if (!(post.userId in dataUsers)) {
          dataUpdate = await updateAccessTokenAsync(
            dataUserLocal.id,
            dataUserLocal.refreshToken
          );
          let dataReturn = await getUserDataLiteAsync(post.userId, dataUpdate.accessToken);
          let newDataUser = {...dataUsers};
          newDataUser[dataReturn.id] = dataReturn
          setDataUsers(newDataUser);
        }
        if (dataPost.interaction.findIndex(interaction => interaction.id === post.id) !== -1) return;
        let newDataPost = dataPost;
        newDataPost.interaction.push(post);
        setDataPost(newDataPost);
        setCountLike(newDataPost.interaction.length)
      });

      newSocket.on("removeInteractionPost", (post) => {
        if (post.postId !== dataPost.id) return;
        const indexInter = dataPost.interaction.findIndex(item => item.id === post.interactionId);
        if (indexInter === -1) return;
        let newDataPost = dataPost;
        newDataPost.interaction.splice(indexInter, 1);
        setDataPost(newDataPost);
        setCountLike(newDataPost.interaction.length)
      });
    }
    socketConnect()
  }, [dataPost, dataUsers, countLike])

  const validateFile = (file) => {
    if (!file || file == "") return "Null";
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

  const fileType = useState(validateFile(post.fileUrl[0]))[0]

  return (
    <View>
      {fileType == "VIDEO" && (
        <View style={{marginBottom: 5}}>
          <View style={{
            position: "absolute",
            zIndex: 1,
            top: 0,
            left: 0,
          }}>
            <PostHeader post={dataPost} users={dataUsers} userCurrent={dataUserCurrent} headerColor='white' />
          </View>
          <PostImage post={dataPost} users={dataUsers} />
          <View>
            <PostFooter post={dataPost} users={dataUsers} userCurrent={dataUserCurrent} />
            <View style={{ marginLeft: 14 }}>
              <Likes post={dataPost} users={dataUsers} likes={countLike} />
            </View>
          </View>
          <View style={{ marginLeft: 14 }}>
            <Caption post={dataPost} users={dataUsers} />
          </View>
        </View>)}
      {fileType == "IMAGE" && (
        <View style={{marginBottom: 5}}>
          <PostHeader post={dataPost} users={dataUsers} userCurrent={dataUserCurrent} />
          <PostImage post={dataPost} users={dataUsers} />
          <View>
            <PostFooter post={dataPost} users={dataUsers} userCurrent={dataUserCurrent}  />
            <View style={{ marginLeft: 14 }}>
              <Likes post={dataPost} users={dataUsers}  likes={countLike} />
            </View>
          </View>
          <View style={{ marginLeft: 14 }}>
            <Caption post={dataPost} users={dataUsers} />
          </View>
        </View>)}
      {fileType == 'Null' && (
      <View style={{marginBottom: 5}}>
        <PostHeader post={dataPost} users={dataUsers} userCurrent={dataUserCurrent} />
        <View style={{ marginLeft: 14 }}>
          <Caption post={dataPost} users={dataUsers} />
        </View>
        <View>
          <PostFooter post={dataPost} users={dataUsers} userCurrent={dataUserCurrent} />
          <View style={{ marginLeft: 14 }}>
            <Likes post={dataPost} users={dataUsers} likes={countLike} />
          </View>
        </View>
      </View>)}
    </View>
  );
});


const Likes = ({ post, users, likes }) => {
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);

  const handlePress = () => {
    setCommentModalVisible(true);
  };

  const closeCommentModal = () => {
    setCommentModalVisible(false);
  };

  return (
    <TouchableOpacity
      style={[headerPostStyles.ItemFooterContainer]}
      onPress={() => handlePress()}
    >
      <Text style={headerPostStyles.likes}>{likes} likes</Text>

      <Modal
        isVisible={isCommentModalVisible}
        onBackdropPress={closeCommentModal}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Header />
          <ItemLike post={post} users={users} />
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

const ItemLike = ({ post, users }) => {
  const navigation = useNavigation();
  const [dataPost, setDataPost] = useState(post);
  const [dataUsers, setDataUsers] = useState(users);

  const handlePressAvatar = async (id) => {
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    const receivedData = { ...dataUserLocal };
    receivedData.id = id;
    navigation.replace("Profile", { data: receivedData });
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: widthPercentageToDP("95%"),
        marginVertical: 10,
      }}
    >
      <View>
        {dataUsers[item.userId] && (
          <TouchableOpacity
            onPress={async () => await handlePressAvatar(item.userId)}
          >
            <Image
              style={{
                height: 45,
                width: 45,
                borderRadius: 40,
                borderWidth: 0.3,
                backgroundColor: "black",
              }}
              source={{ uri: dataUsers[item.userId].detail.avatarUrl }}
            />
          </TouchableOpacity>
        )}

      </View>
      <View style={{ flex: 0.9 }}>
        {dataUsers[item.userId] && (
          <Text style={{ fontWeight: "700" }}>{dataUsers[item.userId].detail.name}</Text>
        )}

        {dataUsers[item.userId] && dataUsers[item.userId].detail.nickName && (
          <Text style={{ color: "#A9A9A9" }}>{dataUsers[item.userId].detail.nickName}</Text>
        )}
      </View>
      <Image style={{width: 30, height: 30}} source={require("../../../assets/dummyicon/heart_fill.png")}/>
    </View>
  );

  return (
    <FlatList
      data={dataPost.interaction}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

const Header = () => {
  return (
    <View>
      <Text
        style={{ fontSize: 20, paddingVertical: 20, paddingHorizontal: 30 }}
      >
        Like
      </Text>
      <Divider width={1} orientation="vertical" />
    </View>
  );
};
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const Caption = ({ post, users }) => {
  return (
    <View style={[headerPostStyles.ItemFooterContainer]}>
      {users[post.ownerUserId] && post.fileUrl.length != 0 && (
        <Text style={{ fontWeight: "600" }}>{users[post.ownerUserId].detail.name}</Text>
      )}
      <Text style={headerPostStyles.caption}> {post.content}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    height: heightPercentageToDP("60%"),
  },
});

export default Post;
