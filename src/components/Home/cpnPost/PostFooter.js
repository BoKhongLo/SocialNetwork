import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  TextInput,
} from "react-native";
import Modal from "react-native-modal";
import headerPostStyles from "./../../../styles/postHeaderStyles";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Divider } from "react-native-elements";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getAllIdUserLocal, getDataUserLocal, updateAccessTokenAsync, addCommentPostAsync } from "../../../util";
import { ValidateMessagesDto } from "../../../util/dto";
const PostFooter = ({
  post,
  onPressLike,
  onPressComment,
  onPressShare,
  onPressBookmark,
  users,
}) => {
  const [likePressed, setLikePressed] = useState(false);
  const [bookmarkPressed, setBookmarkPressed] = useState(false);
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [comment, setComment] = useState("");

  const handleSendPress = async () => {
    if (comment.trim() === "") return
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    const dto = new ValidateMessagesDto(dataUserLocal.id, post.id, "", comment, []);
    dataReturn = await addCommentPostAsync(dto, dataUserLocal.accessToken);
    if ("errors" in dataReturn) {
      const dataUpdate = await updateAccessTokenAsync(
        dataUserLocal.id,
        dataUserLocal.refreshToken
      );
      dataReturn = await addCommentPostAsync(dto, dataUpdate.accessToken);
    }
    if ("errors" in dataReturn) {
      return;
    }
    setComment("");

  };
  const handlePress = (action) => {
    console.log(`${action} pressed!`);
    if (action === "Like") {
      setLikePressed(!likePressed);
    } else if (action === "Bookmark") {
      setBookmarkPressed(!bookmarkPressed);
    } else if (action === "Comment") {
      setCommentModalVisible(true);
    }
  };

  const closeCommentModal = () => {
    setCommentModalVisible(false);
  };

  return (
    <View style={headerPostStyles.postFooterContainer}>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={() => handlePress("Like")}>
          <Image
            style={headerPostStyles.commentsIcon}
            source={
              likePressed
                ? require("../../../../assets/dummyicon/heart_fill.png")
                : require("../../../../assets/dummyicon/heart.png")
            }
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress("Comment")}>
          <Image
            style={headerPostStyles.commentsIcon}
            source={require("../../../../assets/dummyicon/comment_line.png")}
          />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => handlePress("Share")}>
          <Image
            style={headerPostStyles.commentsIcon}
            source={require("../../../../assets/dummyicon/share.png")}
          />
        </TouchableOpacity> */}
      </View>
      <View>
        <TouchableOpacity onPress={() => handlePress("Bookmark")}>
          <Image
            style={headerPostStyles.commentsIcon}
            source={
              bookmarkPressed
                ? require("../../../../assets/dummyicon/bookmarks_fill.png")
                : require("../../../../assets/dummyicon/bookmarks_line.png")
            }
          />
        </TouchableOpacity>
      </View>
      {/* Comment Modal */}
      <Modal
        isVisible={isCommentModalVisible}
        onBackdropPress={closeCommentModal}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Header />
          <ItemComment post={post} users={users} />
          <View
            style={{
              justifyContent: "flex-start",
              borderRadius: 15,
              backgroundColor: "lightgrey",
              margin: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TextInput
              placeholder="Enter your comments"
              style={{ padding: 10, marginLeft: 5 }}
              value={comment}
              onChangeText={(text) => setComment(text)}
            />
            <TouchableOpacity
              onPress={handleSendPress}
              style={{ paddingHorizontal: 20, paddingVertical: 10 }}
            >
              <MaterialCommunityIcons name="send" size={25} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const Header = () => {
  return (
    <View>
      <Text style={{ fontSize: 20, padding: 20, textAlign: "center" }}>
        Comments
      </Text>
      <Divider width={1} orientation="vertical" />
    </View>
  );
};
const ItemComment = ({ post, users }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikePress = () => {
    setIsLiked(!isLiked);
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: widthPercentageToDP("95%"),
        marginVertical: 5,
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
            source={{ uri: users[item.userId].detail.avatarUrl }}
          />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 0.9 }}>
        <Text style={{ fontWeight: "700" }}>
          {users[item.userId].detail.name}
        </Text>
        <Text style={{ fontSize: 17 }}>{item.content}</Text>
        <Text
          style={{ color: "#A9A9A9" }}
        >{`${item.interaction.length} likes`}</Text>
      </View>
      <TouchableOpacity onPress={handleLikePress}>
        <View>
          <Image
            style={{ height: 25, width: 25 }}
            source={
              isLiked
                ? require("../../../../assets/dummyicon/heart_fill.png")
                : require("../../../../assets/dummyicon/heart.png")
            }
          />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={post.comment}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    height: heightPercentageToDP("60%"),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});

export default PostFooter;
