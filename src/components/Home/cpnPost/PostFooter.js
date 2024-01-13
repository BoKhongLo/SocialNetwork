import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import headerPostStyles from "./../../../styles/postHeaderStyles";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Divider } from "react-native-elements";
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
          <ScrollView>
            <ItemComment />
          </ScrollView>
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
  return (
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
        <Image
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            borderWidth: 0.3,
            backgroundColor: "black",
          }}
          source={{}}
        />
      </View>
      <View style={{ flex: 0.9 }}>
        <Text style={{ fontWeight: "700" }}>name</Text>
        <Text style={{ fontSize: 17 }}>content</Text>
        <Text style={{ color: "#A9A9A9" }}>luot like</Text>
      </View>
      <TouchableOpacity>
        <View>
          <Image
            style={{ height: 25, width: 25 }}
            source={require("../../../../assets/dummyicon/heart.png")}
          />
        </View>
      </TouchableOpacity>
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
    height: heightPercentageToDP("70%"),
  },
});

export default PostFooter;