import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  TextInput,
  Touch,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import headerPostStyles from "./../../../styles/postHeaderStyles";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Divider } from "react-native-elements";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  getAllIdUserLocal,
  getDataUserLocal,
  updateAccessTokenAsync,
  getUserDataAsync,
  removeCommentPostAsync,
  addBookmarkAsync,
  removeBookmarkAsync,
  addCommentPostAsync,
  addInteractCommentAsync,
  removeInteractCommentAsync,
  addInteractPostAsync,
  removeInteractPostAsync,
  getSocketIO,
  getUserDataLiteAsync,
  getPostAsync,
  saveDataUserLocal
} from "../../../util";
import {
  InteractDto,
  ValidateMessagesDto,
  BookmarksDto,
} from "../../../util/dto";
import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
const PostFooter = ({
  post,
  onPressComment,
  onPressShare,
  onPressBookmark,
  users,
  userCurrent,
}) => {
  const [likePressed, setLikePressed] = useState(false);
  const [likePostId, setLikePostId] = useState("");
  const [bookmarkPressed, setBookmarkPressed] = useState(false);
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (post.interaction) {
        for (let i = 0; i < post.interaction.length; i++) {
          if (post.interaction[i].userId === userCurrent.id) {
            setLikePressed(true);
            setLikePostId(post.interaction[i].id);
            break;
          }
        }
      }

      if (userCurrent.bookMarks) {
        for (let i = 0; i < userCurrent.bookMarks.length; i++) {
          if (userCurrent.bookMarks[i] === post.id) {
            setBookmarkPressed(true);
            break;
          }
        }
      }
    };
    fetchData();
  }, [post, users, userCurrent]);

  const handleSendPress = async () => {
    if (comment.trim() === "") return;
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    const dto = new ValidateMessagesDto(
      dataUserLocal.id,
      post.id,
      "",
      comment,
      []
    );
    let dataReturn = await addCommentPostAsync(dto, dataUserLocal.accessToken);
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

  const handlePress = async (action) => {
    console.log(`${action} pressed!`);
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    if (action === "Like") {
      if (likePressed == true) {
        if (likePostId === "") return;
        const dto = new InteractDto(
          dataUserLocal.id,
          post.id,
          "",
          "",
          likePostId
        );
        let dataReturn = await removeInteractPostAsync(
          dto,
          dataUserLocal.accessToken
        );
        if ("errors" in dataReturn) {
          const dataUpdate = await updateAccessTokenAsync(
            dataUserLocal.id,
            dataUserLocal.refreshToken
          );
          dataReturn = await removeInteractPostAsync(
            dto,
            dataUpdate.accessToken
          );
        }
        if ("errors" in dataReturn) return;
        setLikePressed(false);
        setLikePostId("");
      } else if (likePostId == false) {
        const dto = new InteractDto(dataUserLocal.id, post.id, "", "HEART", "");
        let dataReturn = await addInteractPostAsync(
          dto,
          dataUserLocal.accessToken
        );
        if ("errors" in dataReturn) {
          const dataUpdate = await updateAccessTokenAsync(
            dataUserLocal.id,
            dataUserLocal.refreshToken
          );
          dataReturn = await addInteractPostAsync(dto, dataUpdate.accessToken);
        }
        if ("errors" in dataReturn) return;
        setLikePressed(true);
        setLikePostId(dataReturn.id);
      }
    } else if (action === "Bookmark") {
      if (bookmarkPressed === true) {
        const dto = new BookmarksDto(dataUserLocal.id, post.id);
        let dataReturn = await removeBookmarkAsync(
          dto,
          dataUserLocal.accessToken
        );
        if ("errors" in dataReturn) {
          const dataUpdate = await updateAccessTokenAsync(
            dataUserLocal.id,
            dataUserLocal.refreshToken
          );
          dataReturn = await removeBookmarkAsync(dto, dataUpdate.accessToken);
        }
        if ("errors" in dataReturn) return;
        setBookmarkPressed(false);
        onPressBookmark(false);
      } else if (bookmarkPressed === false) {
        const dto = new BookmarksDto(dataUserLocal.id, post.id);
        let dataReturn = await addBookmarkAsync(dto, dataUserLocal.accessToken);
        if ("errors" in dataReturn) {
          const dataUpdate = await updateAccessTokenAsync(
            dataUserLocal.id,
            dataUserLocal.refreshToken
          );
          dataReturn = await addBookmarkAsync(dto, dataUpdate.accessToken);
        }
        if ("errors" in dataReturn) return;
        setBookmarkPressed(true);
        onPressBookmark(true);
      }
    } else if (action === "Comment") {
      setCommentModalVisible(true);
    }
  };

  const closeCommentModal = () => {
    setCommentModalVisible(false);
  };

  const renderCommentModal = () => (
    <Modal
      isVisible={isCommentModalVisible}
      onBackdropPress={closeCommentModal}
      style={styles.modalContainer}
    >
      <View style={styles.modalContent}>
        <Header />
        <ItemComment post={post} users={users} userCurrent={userCurrent} />
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
            style={{ paddingHorizontal: 10, paddingVertical: 10}}
          >
            <MaterialCommunityIcons name="send" size={25} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  return (
    <View style={headerPostStyles.postFooterContainer}>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={async () => await handlePress("Like")}>
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
      </View>
      <View>
        <TouchableOpacity onPress={async () => await handlePress("Bookmark")}>
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
      {isCommentModalVisible && renderCommentModal()}
    </View>
  );
};

const Header = React.memo(() => {
  return (
    <View>
      <Text style={{ fontSize: 20, padding: 20, textAlign: "center" }}>
        Comments
      </Text>
      <Divider width={1} orientation="vertical" />
    </View>
  );
});

const ItemComment = React.memo(({ post, users, userCurrent }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [dataUsers, setDataUsers] = useState(users);
  const [dataPost, setDataPost] = useState(post);
  const [dataUserCurrent, setDataUsersCurrent] = useState(userCurrent);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const validateData = async () => {
      const keys = await getAllIdUserLocal();
      const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
      let dataRe = await getPostAsync(post.id, dataUserLocal.accessToken)
      if ("errors" in dataRe) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        await saveDataUserLocal(dataUpdate.id, dataUpdate)
        dataRe = await getPostAsync(post.id, dataUserLocal.accessToken)
      }

      setDataPost(dataRe);
    };

    validateData();
  }, []);


  useEffect(() => {
    const socketConnect = async () => {
      const keys = await getAllIdUserLocal();
      const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
      let dataUpdate = await updateAccessTokenAsync(
        dataUserLocal.id,
        dataUserLocal.refreshToken
      );

      const newSocket = await getSocketIO(dataUpdate.accessToken);
      console.log("Connect socket");

      newSocket.on("addComment", async (comments) => {
        console.log(comments)
        setRefreshing(true);
        if (!(comments.userId in dataUsers)) {
          dataUpdate = await updateAccessTokenAsync(
            dataUserLocal.id,
            dataUserLocal.refreshToken
            );
          let dataReturn = await getUserDataLiteAsync(comments.userId, dataUpdate.accessToken);
          setDataUsers( (preData) => {
            console.log(preData)
            if (!preData) return preData;
            let newDataUser = preData;
            newDataUser[dataReturn.id] = dataReturn
            return newDataUser;
          });
        }
        setDataPost((preData) => {
          if (!preData) return preData;
          if (comments.roomId !== preData.id) return preData;
          if (preData.comment.findIndex(comment => comment.id === comments.id) !== -1) return preData;
          let newDataPost = preData;
          newDataPost.comment.push(comments);
          return newDataPost;
        });
        setRefreshing(false);
      });
      newSocket.on("removeComment", async (comments) => {
        setRefreshing(true);
        setDataPost((preData) => {
          if (!preData) return preData;
          if (comments.postId !== preData.id) return preData;
          let newDataPost = preData;
          newDataPost.comment = newDataPost.comment.filter(comment => comment.id !== comments.commentId)
          return newDataPost;
        });
        setRefreshing(false);
      });
      newSocket.on("addInteractionComment", async (comments) => {
        setRefreshing(true);
        if (!(comments.userId in dataUsers)) {
          dataUpdate = await updateAccessTokenAsync(
            dataUserLocal.id,
            dataUserLocal.refreshToken
            );
          let dataReturn = await getUserDataLiteAsync(comments.userId, dataUpdate.accessToken);
          setDataUsers( (preData) => {
            console.log(preData)
            if (!preData) return preData;
            let newDataUser = preData;
            newDataUser[dataReturn.id] = dataReturn
            return newDataUser;
          });
        }
     
        setDataPost((preData) => {
          if (!preData) return preData;
          if (comments.roomId !== preData.id) return preData;
          const existingComment = preData.comment.findIndex(item => item.id === comments.id);
          if (existingComment == -1) return preData;
          let newDataPost = preData;
          newDataPost.comment[existingComment] = comments;
          newDataPost.comment[existingComment].interaction = newDataPost.comment[existingComment].interaction.filter(item => item.isDisplay === true)
          return newDataPost;
        });
        setRefreshing(false);
      });

      newSocket.on("removeInteractionComment", (comment) => {
        setRefreshing(true);
        setDataPost((preData) => {
          if (!preData) return preData;
          if (comment.postId !== preData.id) return preData;
          const indexComment = preData.comment.findIndex(item => item.id === comment.commentId);
          if (indexComment == -1) return preData;
          const indexInter = preData.comment[indexComment].interaction.findIndex(item => item.id === comment.interactionId);
          if (indexInter == -1) return preData;
          let newDataPost = preData;
          newDataPost.comment[indexComment].interaction = newDataPost.comment[indexComment].interaction.filter(item => item.id !== comment.interactionId)
          return newDataPost;
        });
        setRefreshing(false);
      });
    }
    socketConnect()
  }, [dataUsers])

  const handleLongPress = (comment) => {
    setSelectedComment(comment);
    setIsModalVisible(true);
  };
  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handlePressedAvatar = async (userId) => {
    if (!userId) return;
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    const receivedData = { ...dataUserLocal };
    receivedData.id = userId;
    navigation.replace("Profile", { data: receivedData });
  }

  const handleLikePress = async (comment) => {
    if (!comment) return;
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    const indexInter = comment.interaction.findIndex(
      (it) => it.userId === userCurrent.id
    );

    if (indexInter != -1) {
      const dto = new InteractDto(
        dataUserLocal.id,
        dataPost.id,
        comment.id,
        "",
        comment.interaction[indexInter].id
      );
      let dataReturn = await removeInteractCommentAsync(
        dto,
        dataUserLocal.accessToken
      );
      if ("errors" in dataReturn) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        dataReturn = await removeInteractCommentAsync(
          dto,
          dataUpdate.accessToken
        );
      }
      if ("errors" in dataReturn) return;
    } else {
      const dto = new InteractDto(
        dataUserLocal.id,
        dataPost.id,
        comment.id,
        "HEART",
        ""
      );
      let dataReturn = await addInteractCommentAsync(
        dto,
        dataUserLocal.accessToken
      );
      if ("errors" in dataReturn) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        dataReturn = await addInteractCommentAsync(dto, dataUpdate.accessToken);
      }
      if ("errors" in dataReturn) return;
    }
  };

  const alertDeleteComment = async (comment) => {
    if (!comment) return;
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
      Alert.alert("", "Validate this comment ?", [
      { text: "Cancel", onPress: () => null },
      { text: "Copy", onPress: async () => await Clipboard.setStringAsync(comment.content) },
      comment.userId == dataUserLocal.id && 
      {text:  "Delete", onPress: async() => {
        const dto = new ValidateMessagesDto(
          dataUserLocal.id,
          dataPost.id,
          comment.id,
          "-1",
          []
        );
        let dataReturn = await removeCommentPostAsync(
          dto,
          dataUserLocal.accessToken
        );
        if ("errors" in dataReturn) {
          const dataUpdate = await updateAccessTokenAsync(
            dataUserLocal.id,
            dataUserLocal.refreshToken
          );
          dataReturn = await removeCommentPostAsync(dto, dataUpdate.accessToken);
        }
        console.log(dataReturn);
        if ("errors" in dataReturn) return;
      }},
    ]);
  };
  
  const Item = useCallback(({ item }) => {
      if (item.isDisplay == false) return;
      return (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: widthPercentageToDP("95%"),
            marginVertical: 5,
          }}

          onLongPress={async () => await alertDeleteComment(item)}
        >
          <View>
            <TouchableOpacity
            onPress={async () => await handlePressedAvatar(item.userId)}
            >
              {dataUsers[item.userId] &&
              dataUsers[item.userId].detail.avatarUrl ? (
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
              ) : (
                <Image
                  style={{
                    height: 45,
                    width: 45,
                    borderRadius: 40,
                    borderWidth: 0.3,
                    backgroundColor: "black",
                  }}
                  source={require("../../../../assets/img/avt.png")}
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={{ flex: 0.9 }}>
            {dataUsers[item.userId] && (
              <Text style={{ fontWeight: "700" }}>
                {dataUsers[item.userId].detail.name}
              </Text>
            )}
            <Text style={{ fontSize: 17 }}>{item.content}</Text>
            {item.interaction && (
              <Text style={{ color: "#A9A9A9" }}>
                {`${item.interaction.length} likes`}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={() => handleLikePress(item)}>
            <View>
              {item.interaction && (
                <Image
                  style={{ height: 25, width: 25 }}
                  source={
                    item.interaction.findIndex(
                      (it) => it.userId === userCurrent.id
                    ) !== -1
                      ? require("../../../../assets/dummyicon/heart_fill.png")
                      : require("../../../../assets/dummyicon/heart.png")
                  }
                />
              )}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      );
    },
    [dataUsers, userCurrent, dataPost]
  );

  return (
    <>
      <FlatList
        ref={flatListRef}
        data={dataPost.comment}
        renderItem={({ item }) => <Item item={item} />}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
      />
      <Modal
        visible={isModalVisible}
        transparent={true}
        onBackdropPress={closeModal}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View
          style={{
            backgroundColor: "lightgrey",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingVertical: 7,
          }}
        >
          <TouchableOpacity>
            <Text
              style={{
                color: "black",
                textAlign: "center",
                fontSize: 20,
                marginBottom: 10,
              }}
            >
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{ color: "red", textAlign: "center", fontSize: 20 }}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
});

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
