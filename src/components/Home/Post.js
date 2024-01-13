import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import headerPostStyles from "../../styles/postHeaderStyles";

import PostHeader from "./cpnPost/PostHeader";
import PostFooter from "./cpnPost/PostFooter";
import PostImage from "./cpnPost/PostImage";
import { Divider } from "react-native-elements";

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
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <TouchableOpacity
      style={[headerPostStyles.ItemFooterContainer]}
      onPress={openModal}
    >
      <Text style={headerPostStyles.likes}>{likes} likes</Text>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          onPress={closeModal}
        >
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              height: "60%",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                /* Optional: Add additional logic before closing the modal */
              }}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              }}
            />
            {/* Content of the modal */}
            <Text>Modal Content</Text>

            <TouchableOpacity onPress={closeModal}>
              <Text>Close Modal</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
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

export default Post;
