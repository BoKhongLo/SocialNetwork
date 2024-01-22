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
  Touch,
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
  removeInteractPostAsync,
} from "../../../util";
import {
  InteractDto,
  ValidateMessagesDto,
  BookmarksDto,
} from "../../../util/dto";
import { TouchableHighlight } from "react-native-gesture-handler";

const PostFooter = ({
  post,
  onPressLike,
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
        // setLikePressed(false);
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
  const handleLongPress = (comment) => {
    setSelectedComment(comment);
    setIsModalVisible(true);
  };
  const closeModal = () => {
    setIsModalVisible(false);
  };
  useEffect(() => {
    const validateData = async () => {
      for (let i = 0; i < post.comment.length; i++) {
        if (!post.comment[i].interaction) continue;
        post.comment[i].interaction = post.comment[i].interaction.filter(
          (item) => item.isDisplay !== false
        );
      }
    };

    validateData();
  }, [post, users, userCurrent]);

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
        post.id,
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
        post.id,
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

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: widthPercentageToDP("95%"),
            marginVertical: 5,
          }}
          onLongPress={() => handleLongPress(item)}
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
    [post, users, userCurrent]
  );

  return (
    <>
      <FlatList
        data={post.comment}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <Modal
        visible={isModalVisible}
        transparent={true}
        onBackdropPress={closeModal}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View
          style={{backgroundColor: "lightgrey", borderTopLeftRadius:20,borderTopRightRadius:20,paddingVertical:7}}
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
