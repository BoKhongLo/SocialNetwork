import React, { useState, useEffect, useCallback } from "react";
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
import {
  getAllIdUserLocal,
  getDataUserLocal,
  updateAccessTokenAsync,
  getUserDataAsync,
  addBookmarkAsync,
  removeBookmarkAsync,
  addCommentPostAsync,
  addInteractCommentAsync,
  removeInteractCommentAsync,
  addInteractPostAsync,
  removeInteractPostAsync
} from "../../../util";
import {
  InteractDto,
  ValidateMessagesDto,
  BookmarksDto
} from "../../../util/dto";
const PostFooter = React.memo(({
  post,
  onPressLike,
  onPressComment,
  onPressShare,
  onPressBookmark,
  users,
}) => {
  const [likePressed, setLikePressed] = useState(false);
  const [likePostId, setLikePostId] = useState("");
  const [bookmarkPressed, setBookmarkPressed] = useState(false);
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const keys = await getAllIdUserLocal();
      const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
      let dataReturn = await getUserDataAsync(dataUserLocal.id, dataUserLocal.accessToken);
      if ("errors" in dataReturn) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        dataReturn = await getUserDataAsync(dataUserLocal.id, dataUpdate.accessToken);
      }
      if (post.interaction) {
        for (let i = 0; i < post.interaction.length; i++) {
          if (post.interaction[i].userId === dataUserLocal.id) {
            setLikePressed(true);
            setLikePostId(post.interaction[i].id);
            break;
          }
        }
      }

      if (dataReturn.bookMarks) {
        for (let i = 0; i < dataReturn.bookMarks.length; i++) {
          if (dataReturn.bookMarks[i] === post.id) {
            setBookmarkPressed(true);
            break;
          }
        }
      }

    }
    fetchData();
  }, [post, users])

  const handleSendPress = async () => {
    if (comment.trim() === "") return
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    const dto = new ValidateMessagesDto(dataUserLocal.id, post.id, "", comment, []);
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
        const dto = new InteractDto(dataUserLocal.id, post.id, "", "", likePostId);
        let dataReturn = await removeInteractPostAsync(dto, dataUserLocal.accessToken)
        if ("errors" in dataReturn) {
          const dataUpdate = await updateAccessTokenAsync(
            dataUserLocal.id,
            dataUserLocal.refreshToken
          );
          dataReturn = await removeInteractPostAsync(dto, dataUpdate.accessToken);
        }
        if ("errors" in dataReturn) return;
        setLikePressed(false);
      }
      else if (likePostId == false) {
        const dto = new InteractDto(dataUserLocal.id, post.id, "", "HEART", "");
        let dataReturn = await addInteractPostAsync(dto, dataUserLocal.accessToken)
        if ("errors" in dataReturn) {
          const dataUpdate = await updateAccessTokenAsync(
            dataUserLocal.id,
            dataUserLocal.refreshToken
          );
          dataReturn = await addInteractPostAsync(dto, dataUpdate.accessToken);
        }
        if ("errors" in dataReturn) return;
        setLikePressed(true);
      }
    } else if (action === "Bookmark") {
      if (bookmarkPressed === true) {
        const dto = new BookmarksDto(dataUserLocal.id, post.id);
        let dataReturn = await removeBookmarkAsync(dto, dataUserLocal.accessToken)
        if ("errors" in dataReturn) {
          const dataUpdate = await updateAccessTokenAsync(
            dataUserLocal.id,
            dataUserLocal.refreshToken
          );
          dataReturn = await removeBookmarkAsync(dto, dataUpdate.accessToken);
        }
        if ("errors" in dataReturn) return;
        setBookmarkPressed(false);
      }
      else if (bookmarkPressed === false) {
        const dto = new BookmarksDto(dataUserLocal.id, post.id);
        let dataReturn = await addBookmarkAsync(dto, dataUserLocal.accessToken)
        if ("errors" in dataReturn) {
          const dataUpdate = await updateAccessTokenAsync(
            dataUserLocal.id,
            dataUserLocal.refreshToken
          );
          dataReturn = await addBookmarkAsync(dto, dataUpdate.accessToken);
        }
        if ("errors" in dataReturn) return;
        setBookmarkPressed(true);
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
  );
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
      {isCommentModalVisible && renderCommentModal()}
    </View>
  );
});

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
const ItemComment = React.memo(({ post, users }) => {
  const [isLiked, setIsLiked] = useState({});

  useEffect(() => {
    const validateData = async () => {
      const keys = await getAllIdUserLocal();
      const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);

      let newIsLike = {};

      for (let i = 0; i < post.comment.length; i++) {
        let isCheck = false;
        let isId = "";
        post.comment[i].interaction = post.comment[i].interaction.filter(item => item.isDisplay !== false)
        for (let j = 0; j < post.comment[i].interaction.length; j++) {
          if (post.comment[i].interaction[j].userId === dataUserLocal.id) {
            isCheck = true;
            isId = post.comment[i].interaction[j].id;
            break;
          }
        }
        newIsLike[post.comment[i].id] = {
          value: isCheck,
          id: isId
        }
      }
      setIsLiked(newIsLike);
    };

    validateData();
  }, [post, users]);

  const handleLikePress = useCallback(async (commentId) => {
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    if (isLiked[commentId].value) {
      if (isLiked[commentId].id === "") return;
      const dto = new InteractDto(dataUserLocal.id, post.id, commentId, "", isLiked[commentId].id)
      let dataReturn = await removeInteractCommentAsync(dto, dataUserLocal.accessToken)
      console.log(dataReturn)
      if ("errors" in dataReturn) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        dataReturn = await addInteractCommentAsync(dto, dataUpdate.accessToken);
      }
      if ("errors" in dataReturn) return;
      setIsLiked(preData => {
        preData[commentId].value = !preData[commentId].value;
        preData[commentId].id = "";
        return preData;
      });
    }
    else {
      const dto = new InteractDto(dataUserLocal.id, post.id, commentId, "HEART", "")
      let dataReturn = await addInteractCommentAsync(dto, dataUserLocal.accessToken)
      if ("errors" in dataReturn) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        dataReturn = await addInteractCommentAsync(dto, dataUpdate.accessToken);
      }
      if ("errors" in dataReturn) return;
      setIsLiked(preData => {
        preData[commentId].value = !preData[commentId].value;
        preData[commentId].id = dataReturn.id;
        return preData;
      });
    }
  }, [isLiked]);

  const renderItem = useCallback(({ item }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: widthPercentageToDP('95%'),
          marginVertical: 5,
        }}
      >
        <View>
          <TouchableOpacity>
            {users[item.userId].detail.avatarUrl ? (
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
            ) : (
              <Image
                style={{
                  height: 45,
                  width: 45,
                  borderRadius: 40,
                  borderWidth: 0.3,
                  backgroundColor: "black",
                }}

              />
            )}

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
        <TouchableOpacity onPress={() => handleLikePress(item.id)}>
          <View>
            {isLiked[item.id] !== undefined && (
              <Image
                style={{ height: 25, width: 25 }}
                source={
                  isLiked[item.id].value
                    ? require('../../../../assets/dummyicon/heart_fill.png')
                    : require('../../../../assets/dummyicon/heart.png')
                }
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }, [isLiked]);

  return (
    <FlatList
      data={post.comment}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
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