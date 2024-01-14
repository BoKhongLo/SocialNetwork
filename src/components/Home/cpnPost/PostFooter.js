import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import Modal from "react-native-modal";
import headerPostStyles from "./../../../styles/postHeaderStyles";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Divider } from "react-native-elements";

const commentsData = [
  { id: 1, name: "John Doe", content: "Great post!", likes: 10 },
];

const PostFooter = ({
  post,
  onPressLike,
  onPressComment,
  onPressShare,
  onPressBookmark,
}) => {
  const { likes } = post;

  const [likePressed, setLikePressed] = useState(false);
  const [bookmarkPressed, setBookmarkPressed] = useState(false);
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);

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
        <TouchableOpacity onPress={() => handlePress("Share")}>
          <Image
            style={headerPostStyles.commentsIcon}
            source={require("../../../../assets/dummyicon/share.png")}
          />
        </TouchableOpacity>
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
          <ItemComment />
        </View>
      </Modal>
    </View>
  );
};
const Header = () => {
  return (
    <View>
      <Text style={{ fontSize: 20, padding: 20 }}>Comments</Text>
      <Divider width={1} orientation="vertical" />
    </View>
  );
};
const ItemComment = () => {
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
            source={{ uri: item.avatar }} // Replace with the actual avatar URL
          />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 0.9 }}>
        <Text style={{ fontWeight: "700" }}>{item.name}</Text>
        <Text style={{ fontSize: 17 }}>{item.content}</Text>
        <Text style={{ color: "#A9A9A9" }}>{`${item.likes} likes`}</Text>
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
      data={commentsData}
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
    borderRadius: 10,
    alignItems: "center",
    height: heightPercentageToDP("60%"),
  },
});

export default PostFooter;