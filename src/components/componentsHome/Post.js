import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Divider } from "react-native-elements";
import headerPoststyles from "./../../styles/postHeaderStyles";

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
        <Comments post={post}/>
      </View>
    </View>
  );
};

const PostHeader = ({
  post,
  onAvatarPress,
  onUsernamePress,
  onEllipsisPress,
}) => {
  const { username, avt} = post[0];

  const handleAvatarPress = () => {
    console.log("Avatar pressed!");
    if (onAvatarPress) {
      onAvatarPress();
    }
  };

  const handleUsernamePress = () => {
    console.log("Username pressed!");
    if (onUsernamePress) {
      onUsernamePress();
    }
  };

  const handleEllipsisPress = () => {
    console.log("3Dots pressed!");
    if (onEllipsisPress) {
      onEllipsisPress();
    }
  };

  return (
    <View style={headerPoststyles.containerHeaderPost}>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={handleAvatarPress}>
          <Image style={headerPoststyles.avatar} source={avt} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleUsernamePress}>
          <Text style={headerPoststyles.userName}>{username}</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={handleEllipsisPress}>
          <Image
            style={{ width: 25, height: 25 }}
            source={require("../../../assets/dummyicon/icons8-ellipsis-25.png")}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PostImage = ({ post, onPressImgPost }) => {
  const { imagepost } = post[0];

  const handleImagePress = () => {
    console.log("Image pressed!");
    if (onPressImgPost) {
      onPressImgPost();
    }
  };

  return (
    <TouchableOpacity onPress={handleImagePress}>
      <View style={headerPoststyles.frame}>
        <Image style={headerPoststyles.image} source={imagepost} />
      </View>
    </TouchableOpacity>
  );
};

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
    <View style={headerPoststyles.postFooterContainer}>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={() => handlePress("Like")}>
          <Image
            style={headerPoststyles.commentsIcon}
            source={
              likePressed
                ? require("../../../assets/dummyicon/icons8-favorite-liked.png")
                : require("../../../assets/dummyicon/icons8-heart-like25.png")
            }
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress("Comment")}>
          <Image
            style={headerPoststyles.commentsIcon}
            source={require("../../../assets/dummyicon/icons8-comments-25.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress("Share")}>
          <Image
            style={headerPoststyles.commentsIcon}
            source={require("../../../assets/dummyicon/icons8-share-25.png")}
          />
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => handlePress("Bookmark")}>
          <Image
            style={headerPoststyles.commentsIcon}
            source={
              bookmarkPressed
                ? require("../../../assets/dummyicon/icons8-bookmark-checked.png")
                : require("../../../assets/dummyicon/icons8-bookmark-25.png")
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
    <View style={headerPoststyles.likesContainer}>
      <Text style={headerPoststyles.likes}> {likes} likes</Text>
    </View>
  );
};

const Caption = ({ post }) => {
  const { username, captions } = post[0];
  return (
    <View style={headerPoststyles.captionContainer}>
      <Text style={{ fontWeight: "600", marginLeft: 10 }}>{username}</Text>
      <Text style={headerPoststyles.caption}> {captions}</Text>
    </View>
  );
};

const Comments = ({ post }) => {
  const { comments } = post;

  return (
    <View style={{marginTop : 5}}> 
        <Text style={{ color: "gray", marginHorizontal: 10 }}>
            View comments
        </Text>
    </View>
  );
};

export default Post;
