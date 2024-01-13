import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  ImageBackground,
} from "react-native";
import headerPostStyles from "../../styles/postHeaderStyles";

import PostHeader from "./cpnPost/PostHeader";
import PostFooter from "./cpnPost/PostFooter";
import PostImage from "./cpnPost/PostImage";
import { Divider } from 'react-native-elements';

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