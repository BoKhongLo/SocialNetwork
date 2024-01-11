import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Divider } from "react-native-elements";
import headerPostStyles from "./../../styles/postHeaderStyles";
import highLight from "../../styles/highLightStyles";
import Modal from "react-native-modal";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Post = ({ post }) => {
  return (
    <View style={{ marginBottom: 30 }}>
      <Divider width={1} orientation="vertical" />
      <PostHeader post={post} />
      <PostImage post={post} />
      <View>
        <PostFooter post={post} />
        <Likes post={post} />
        <Caption post={post} />
        <Comments post={post} />
      </View>
    </View>
  );
};

const PostHeader = ({ post, onAvatarPress, onEllipsisPress }) => {
  const { username, avt } = post[0];
  const [isModalVisible, setModalVisible] = useState(false);

  const handleAvatarPress = () => {
    console.log("Avatar pressed!");
    if (onAvatarPress) {
      onAvatarPress();
    }
  };

  const handleEllipsisPress = () => {
    console.log("3Dots pressed!");
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={headerPostStyles.containerHeaderPost}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableHighlight
          style={highLight.highLightAVTpost}
          underlayColor="lightgray"
          onPress={handleAvatarPress}
        >
          <Image style={headerPostStyles.avatar} source={avt} />
        </TouchableHighlight>
        <View>
          <Text style={headerPostStyles.userName}>{username}</Text>
        </View>
      </View>

      <View>
        <TouchableWithoutFeedback onPress={handleEllipsisPress}>
          <Image
            style={{ width: 30, height: 30 }}
            source={require("../../../assets/dummyicon/more_1_line.png")}
          />
        </TouchableWithoutFeedback>
      </View>

      <Modal
        isVisible={isModalVisible}
        style={{ margin: 0, justifyContent: "flex-end" }}
        onBackdropPress={closeModal}
      >
        <View
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            justifyContent: "space-between",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: heightPercentageToDP("30%"),
          }}
        >
          <Text>This is your modal content</Text>
        </View>
      </Modal>
    </View>
  );
};

const PostImage = ({ post }) => {
  const { imagepost } = post[0];
  const [isModalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const handleImagePress = () => {
    console.log("Image pressed!");
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const onModalShow = () => {
    // The modal is shown, update the state to display the close button
    console.log("Modal is shown!");
  };

  const onModalDismiss = () => {
    // The modal is dismissed, update the state to hide the close button
    console.log("Modal is dismissed!");
  };

  return (
    <TouchableOpacity onPress={handleImagePress}>
      <Image style={headerPostStyles.image} source={imagepost} />

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
        onShow={onModalShow}
        onDismiss={onModalDismiss}
        backdropOpacity={0.8}
        animationType="none"

        style={{
          margin: 0,
          justifyContent: "center",
          flex: 1,
        }}
      >
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <Image
            style={{ height: 40, width: 40 }}
            source={require("../../../assets/dummyicon/close.png")}
          />
        </TouchableOpacity>

        <Image
          style={{
            width: "100%",
            height: "95%",
            resizeMode: "contain",
          }}
          source={imagepost}
        />
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 15,
    zIndex: 1,
    justifyContent: "center",
  },
});

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

  const handlePress = (action) => {
    console.log(`${action} pressed!`);
    if (action === "Like") {
      setLikePressed(!likePressed);
    } else if (action === "Bookmark") {
      setBookmarkPressed(!bookmarkPressed);
    }
  };

  return (
    <View style={headerPostStyles.postFooterContainer}>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={() => [handlePress("Like")]}>
          <Image
            style={headerPostStyles.commentsIcon}
            source={
              likePressed
                ? require("../../../assets/dummyicon/heart_fill.png")
                : require("../../../assets/dummyicon/heart.png")
            }
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => [handlePress("Comment")]}>
          <Image
            style={headerPostStyles.commentsIcon}
            source={require("../../../assets/dummyicon/comment_line.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress("Share")}>
          <Image
            style={headerPostStyles.commentsIcon}
            source={require("../../../assets/dummyicon/share.png")}
          />
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => handlePress("Bookmark")}>
          <Image
            style={headerPostStyles.commentsIcon}
            source={
              bookmarkPressed
                ? require("../../../assets/dummyicon/bookmarks_fill.png")
                : require("../../../assets/dummyicon/bookmarks_line.png")
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Likes = ({ post }) => {
  const { likes } = post[0];
  return (
    <View style={headerPostStyles.likesContainer}>
      <Text style={headerPostStyles.likes}> {likes} likes</Text>
    </View>
  );
};

const Caption = ({ post }) => {
  const { username, captions } = post[0];
  return (
    <View style={headerPostStyles.captionContainer}>
      <Text style={{ fontWeight: "600", marginLeft: 10 }}>{username}</Text>
      <Text style={headerPostStyles.caption}> {captions}</Text>
    </View>
  );
};

const Comments = ({ post }) => {
  const { comments } = post;

  return (
    <View style={{ marginTop: 5 }}>
      <Text style={{ color: "gray", marginHorizontal: 10 }}>View comments</Text>
    </View>
  );
};

export default Post;
