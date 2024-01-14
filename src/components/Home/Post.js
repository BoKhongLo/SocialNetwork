import React, { useState } from "react";
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

import { Divider } from "react-native-elements";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import profileStyle from "../../styles/profileStyles";

const commentsData = [
  { id: 1, name: "John Doe", content: "Great post!", likes: 10, status: 1 },
];

const Post = ({ post }) => {
  return (
    <View>
      <Divider width={1} orientation="vertical" />
      <PostHeader post={post} />
      <PostImage post={post} />
      <View>
        <PostFooter post={post} />
        <View style={{ marginLeft: 10 }}>
          <Likes post={post} />
          <Caption post={post} />
        </View>
      </View>
    </View>
  );
};

const Likes = ({ post }) => {
  const { likes } = post[0];
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
      <Text style={headerPostStyles.likes}>{likes} likes</Text>

      <Modal
        isVisible={isCommentModalVisible}
        onBackdropPress={closeCommentModal}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Header />
          <ItemLike data={commentsData} />
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

const ItemLike = ({ data }) => {
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
        <TouchableOpacity>
          <Image
            style={{
              height: 45,
              width: 45,
              borderRadius: 40,
              borderWidth: 0.3,
              backgroundColor: "black",
            }}
            source={{ uri: item.avatar }}
          />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 0.9 }}>
        <Text style={{ fontWeight: "700" }}>{item.name}</Text>
        <Text style={{ color: "#A9A9A9" }}>nickname</Text>
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
      data={data}
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

const Caption = ({ post }) => {
  const { username, captions } = post[0];
  return (
    <View style={[headerPostStyles.ItemFooterContainer, { marginBottom: 30 }]}>
      <Text style={{ fontWeight: "600" }}>{username}</Text>
      <Text style={headerPostStyles.caption}> {captions}</Text>
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