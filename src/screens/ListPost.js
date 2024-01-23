import { View, Text, Image, ScrollView, FlatList } from "react-native";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Divider } from "react-native-elements";
import notistyles from "../styles/notiStyles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "../styles/styles";
import {
  getAllIdUserLocal,
  getDataUserLocal,
  updateAccessTokenAsync,
  getAllPostUserAsync,
  getUserDataLiteAsync,
  getSocketIO,
  getPostAsync,
  getUserDataAsync,
} from "../util";
import Post from "../components/Home/Post";
const ListPost = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation();
  const receivedData = route.params?.data
  const [dataPost, setDataPost] = useState([]);
  const [dataUser, setDataUser] = useState({});
  const [dataUserCurrent, setDataUserCurrent] = useState({});

  useEffect(() => {
    if (!receivedData) {
      navigation.navigate("main")
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const keys = await getAllIdUserLocal();
      const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
      const dataUserLocal = { ...dataLocal }

      let dataReturn = await getUserDataAsync(
        dataUserLocal.id,
        dataUserLocal.accessToken
      );

      if ("errors" in dataReturn) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        dataUserLocal.accessToken = dataUpdate.accessToken;
        dataReturn = await getUserDataAsync(
          dataUserLocal.id,
          dataUpdate.accessToken
        );
      }

      let tmpPost = [];
      let tmpUserData = {}
      dataReturn.bookMarks = [...new Set(dataReturn.bookMarks)]
      for (let i = 0; i < dataReturn.bookMarks.length; i++) {
        let post = await getPostAsync(dataReturn.bookMarks[i], dataUserLocal.accessToken)
        if (post.isDisplay == false) continue;
        if (post.type === "POST") {
          let dataUserOwner = await getUserDataLiteAsync(post.ownerUserId, dataUserLocal.accessToken)
          tmpUserData[dataUserOwner.id] = dataUserOwner;
          for (let comment of post.comment) {
            if (comment.userId in tmpUserData) continue;
            let dataUserComment = await getUserDataLiteAsync(comment.userId, dataUserLocal.accessToken)
            tmpUserData[dataUserComment.id] = dataUserComment;
          }
          for (let interaction of post.interaction) {
            if (interaction.userId in tmpUserData) continue;
            let dataUserInteraction = await getUserDataLiteAsync(interaction.userId, dataUserLocal.accessToken)
            tmpUserData[dataUserInteraction.id] = dataUserInteraction;
          }
          if (post.interaction) {
            post.interaction = post.interaction.filter(item => item.isDisplay !== false)
          }
          tmpPost.push(post);
        }
      }
      tmpPost.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setDataUser(tmpUserData);
      setDataPost(tmpPost);
      let dataUserCurrent = await getUserDataAsync(dataUserLocal.id, dataUserLocal.accessToken);
      setDataUserCurrent(dataUserCurrent)
    };

    fetchData();
  }, []);
  useEffect(() => {
    const socketConnect = async () => {
      const keys = await getAllIdUserLocal();
      const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
      const dataUpdate = await updateAccessTokenAsync(
        dataUserLocal.id,
        dataUserLocal.refreshToken
      );

      const newSocket = await getSocketIO(dataUpdate.accessToken);

      newSocket.on("removePost", (post) => {
        setDataPost((prevPosts) => prevPosts.filter(item => item.id !== post.postId));
      });

      newSocket.on("addComment", async (comments) => {
        setDataUser( async(preUser) => {
          if (comments.userId in preUser) return preUser;
          const dataUpdate = await updateAccessTokenAsync(
            dataUserLocal.id,
            dataUserLocal.refreshToken
          );
          let dataReturn = await getUserDataLiteAsync(comments.userId, dataUpdate.accessToken)
          preUser[dataReturn.id] = dataReturn
          return preUser;
        })
        setDataPost(prePost => {
          for (let i = 0; i < prePost.length; i++) {
            if (prePost[i].id === comments.roomId) {
              if (prePost[i].comment.findIndex(item => item.id === comments.id) !== -1) break;
              prePost[i].comment.push(comments);
              break;
            }
          }
          return prePost;
        })
      });

      newSocket.on("addInteractionPost!", (post) => {
        setDataPost((prePost) => {
          for (let i = 0; i < prePost.length; i++) {
            if (prePost[i].id === post.postId) {
              if (prePost[i].interaction.findIndex(item => item.id === post.id) !== -1) break;
              prePost[i].interaction.push(post);;
              break;
            }
          }
          return prePost;
        });
      });

      newSocket.on("removeInteractionPost", (post) => {
        setDataPost((prePost) => {
          const indexPost = prePost.findIndex(item => item.id === post.postId);
          if (indexPost === -1) return prePost;
          const indexInter = prePost[indexPost].interaction.findIndex(item => item.id === post.interactionId);
          if (indexInter === -1) return prePost;
          prePost[indexPost].interaction.splice(indexInter, 1);
          return prePost;
        });
      });

      newSocket.on("addInteractionComment", (comment) => {
        setDataUser( async(preUser) => {
          if (comment.userId in preUser) return preUser;
          const dataUpdate = await updateAccessTokenAsync(
            dataUserLocal.id,
            dataUserLocal.refreshToken
          );
          let dataReturn = await getUserDataLiteAsync(comment.userId, dataUpdate.accessToken)
          preUser[dataReturn.id] = dataReturn
          return preUser;
        })
        setDataPost((prePost) => {
          const indexPost = prePost.findIndex(item => item.id === comment.roomId);
          if (indexPost === -1) return prePost;
          const indexComment = prePost[indexPost].comment.findIndex(item => item.id == comment.id)
          if (indexComment === -1) return prePost;
          prePost[indexPost].comment[indexComment].interaction.push(comment)
          return prePost;
        });
      });

      newSocket.on("removeInteractionComment", (comment) => {
        setDataPost((prePost) => {
          const indexPost = prePost.findIndex(item => item.id === comment.postId);
          if (indexPost === -1) return prePost;
          const indexComment = prePost[indexPost].comment.findIndex(item => item.id === comment.commentId)
          if (indexComment === -1) return prePost;
          const indexInter = prePost[indexPost].comment[indexComment].interaction.findIndex(item => item.id == comment.interactionId);
          if (indexInter === -1) return prePost;
          prePost[indexPost].comment[indexComment].interaction.splice(indexInter, 1)
          return prePost;
        });
      });
    }
    socketConnect()
  }, [])


  const VirtualizedView = (props) => {
    return (
      <FlatList
        data={[]}
        ListEmptyComponent={null}
        keyExtractor={() => "dummy"}
        renderItem={null}
        ListHeaderComponent={() => (
          <React.Fragment>{props.children}</React.Fragment>
        )}
      />
    );
  }
  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        flex: 1,
      }}
    >
      <Header userId={receivedData.userId} />
      <Divider width={1} orientation="vertical" />
      <VirtualizedView style={{ flex: 1 }}>
        {dataPost.map((item, index) => (
          <Post
            key={`${item.id}`}
            post={item}
            users={dataUser}
            userCurrent={dataUserCurrent}
            style={{ flex: 1 }} />
        ))}
      </VirtualizedView>
    </View>
  );
};

const Header = ({ userId }) => {
  const navigation = useNavigation();
  const handleReBack = async () => {
    const keys = await getAllIdUserLocal();
    const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
    let dataReBack = { ...dataLocal }
    dataReBack.id = userId;
    navigation.replace("Profile", { data: dataReBack });
  }
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <TouchableOpacity onPress={handleReBack}>
        <Image
          style={[styles.iconforAll]}
          source={require("../../assets/dummyicon/left_line_64.png")}
        />
      </TouchableOpacity>
      <Text style={notistyles.headerName}>Bookmarks</Text>
    </View>
  );
};

export default ListPost;
