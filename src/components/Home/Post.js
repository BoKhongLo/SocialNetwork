import React, { useState, useMemo } from "react";
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

const Post = ({ post, users, userCurrent }) => {
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

  const fileType = useState(validateFile(post.fileUrl[0]))[0]

  return (
    <View>
      {fileType == "VIDEO" && (
        <View>
          <View style={{
            position: "absolute",
            zIndex: 1,
            top: 0,
            left: 0,
          }}>
            <PostHeader post={post} users={users} userCurrent={userCurrent} headerColor='white' />
          </View>
          <PostImage post={post} users={users} />
          <View>
            <PostFooter post={post} users={users} userCurrent={userCurrent} />
            <View style={{ marginLeft: 14 }}>
              <Likes post={post} users={users} />
            </View>
          </View>
          <View style={{ marginLeft: 14 }}>
            <Caption post={post} users={users} />
          </View>
        </View>)}
      {fileType == "IMAGE" && (
        <View>
          <PostHeader post={post} users={users} userCurrent={userCurrent} />
          <PostImage post={post} users={users} />
          <View>
            <PostFooter post={post} users={users} userCurrent={userCurrent} />
            <View style={{ marginLeft: 14 }}>
              <Likes post={post} users={users} />
            </View>
          </View>
          <View style={{ marginLeft: 14 }}>
            <Caption post={post} users={users} />
          </View>
        </View>)}
    </View>
  );
};


const Likes = ({ post, users }) => {
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);

  const handlePress = (action) => {
    console.log(`${action} pressed!`);
    if (action === "Comment") {
      setCommentModalVisible(true);
    }
  };

  const closeCommentModal = () => {
    setCommentModalVisible(false);
  };

  return (
    <TouchableOpacity
      style={[headerPostStyles.ItemFooterContainer]}
      onPress={() => handlePress("Comment")}
    >
      <Text style={headerPostStyles.likes}>{post.interaction.length} likes</Text>

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
  const [isFriendAdded, setFriendAdded] = useState(false);

  const handleAddFriendPress = () => {
    setFriendAdded(!isFriendAdded);
    // Perform other actions when the button is pressed
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
        {users[item.userId] && (
          <TouchableOpacity>
            <Image
              style={{
                height: 45,
                width: 45,
                borderRadius: 40,
                borderWidth: 0.3,
                backgroundColor: "black",
              }}
              source={{ uri: users[item.userId].detail.avatarUrl }}
            />
          </TouchableOpacity>
        )}

      </View>
      <View style={{ flex: 0.9 }}>
        {users[item.userId] && (
          <Text style={{ fontWeight: "700" }}>{users[item.userId].detail.name}</Text>
        )}

        {users[item.userId] && users[item.userId].detail.nickName && (
          <Text style={{ color: "#A9A9A9" }}>{users[item.userId].detail.nickName}</Text>
        )}
      </View>
      <TouchableOpacity
        style={[
          profileStyle.editContainer,
          isFriendAdded
            ? { backgroundColor: "#1E90FF" }
            : { backgroundColor: "lightgrey" },
          { marginHorizontal: 12 },
        ]}
        onPress={handleAddFriendPress}
      >
        <Text
          style={[
            profileStyle.textEdit,
            isFriendAdded ? { color: "white" } : null,
          ]}
        >
          {isFriendAdded ? "   Added     " : "Add Friend"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={post.interaction}
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

const Caption = ({ post, users }) => {
  return (
    <View style={[headerPostStyles.ItemFooterContainer]}>
      {users[post.ownerUserId] && (
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