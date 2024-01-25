import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  View,
  ScrollView,
  Animated,
  SafeAreaView,
  RefreshControl,
  Image,
  Text,
  StyleSheet,
  FlatList
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../components/Home/Header";
import Stories from "../components/Home/Stories";
import BottomTabs from "../components/Home/BottomTabs";
import Post from "../components/Home/Post";
import { useRoute } from "@react-navigation/native"
import {
  getAllIdUserLocal,
  getDataUserLocal,
  updateAccessTokenAsync,
  getPostDailyAsync,
  getUserDataLiteAsync,
  getSocketIO,
  getUserDataAsync
} from "../util";
import { registerIndieID, unregisterIndieDevice } from 'native-notify';
import NewStory from './NewStory';

const HomeScreen = () => {
  const route = useRoute();
  const [receivedData, setReceivedData] = useState(route.params?.data || null);
  const insets = useSafeAreaInsets();
  const [dataPost, setDataPost] = useState([]);
  const [dataStory, setDataStory] = useState([]);
  const [dataUser, setDataUser] = useState({});
  const [dataUserCurrent, setDataUserCurrent] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const keys = await getAllIdUserLocal();
      const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
      const dataUserLocal = { ...dataLocal }
      if (receivedData === null) {
        setReceivedData(dataUserLocal);
      }

      let dataReturn = await getPostDailyAsync(
        dataUserLocal.id,
        dataUserLocal.accessToken
      );

      if ("errors" in dataReturn) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        dataUserLocal.accessToken = dataUpdate.accessToken;
        dataReturn = await getPostDailyAsync(
          dataUserLocal.id,
          dataUpdate.accessToken
        );
      }
      // registerIndieID(dataUserLocal.id, 18604, '8sbEFbNYoDaZJKMDeIAWoc');
      let tmpPost = [];
      let tmpUserData = {};
      let tmpStory = [];
      for (let post of dataReturn) {
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
        else if (post.type === "STORY") {
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
          tmpStory.push(post);
        }
      }

      tmpStory.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      tmpPost.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setDataUser(tmpUserData);
      setDataPost(tmpPost);
      setDataStory(tmpStory);
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
        setDataUser(async (preUser) => {
          if (!(comments.userId in preUser)) {
            const dataUpdate = await updateAccessTokenAsync(
              dataUserLocal.id,
              dataUserLocal.refreshToken
            );
            let dataReturn = await getUserDataLiteAsync(comments.userId, dataUpdate.accessToken);
            preUser[dataReturn.id] = dataReturn;
          }
          return preUser;
        });
      
        setDataPost((prePost) => {
          const existingPost = prePost.find(item => item.id === comments.roomId);
          if (existingPost) {
            const existingComment = existingPost.comment.find(item => item.id === comments.id);
            if (!existingComment) {
              existingPost.comment.push(comments);
              return [...prePost];
            }
          }
          return prePost;
        });
      });
      
      newSocket.on("addInteractionPost!", (post) => {
        setDataPost((prePost) => {
          console.log("prePost: ", prePost);
          const existingPost = prePost.find(item => item.id === post.postId);
          if (existingPost) {
            const existingInteraction = existingPost.interaction.find(item => item.id === post.id);
            if (!existingInteraction) {
              existingPost.interaction.push(post);
              return prePost;
            }
          }
          return prePost;
        });
      });
      
      newSocket.on("removeInteractionPost", (post) => {
        setDataPost((prePost) => {
          const existingPost = prePost.find(item => item.id === post.postId);
          if (existingPost) {
            const indexInter = existingPost.interaction.findIndex(item => item.id === post.interactionId);
            if (indexInter !== -1) {
              existingPost.interaction.splice(indexInter, 1);
              return prePost;
            }
          }
          return prePost;
        });
      });
      
      newSocket.on("addInteractionComment", (comment) => {
        setDataUser(async (preUser) => {
          if (!(comment.userId in preUser)) {
            const dataUpdate = await updateAccessTokenAsync(
              dataUserLocal.id,
              dataUserLocal.refreshToken
            );
            let dataReturn = await getUserDataLiteAsync(comment.userId, dataUpdate.accessToken);
            preUser[dataReturn.id] = dataReturn;
          }
          return preUser;
        });
      
        setDataPost((prePost) => {
          const existingPost = prePost.find(item => item.id === comment.roomId);
          if (existingPost) {
            const existingComment = existingPost.comment.find(item => item.id === comment.id);
            if (existingComment) {
              existingComment.interaction.push(comment);
              return [...prePost];
            }
          }
          return prePost;
        });
      });
      
      newSocket.on("removeInteractionComment", (comment) => {
        setDataPost((prePost) => {
          const existingPost = prePost.find(item => item.id === comment.postId);
          if (existingPost) {
            const existingComment = existingPost.comment.find(item => item.id === comment.commentId);
            if (existingComment) {
              const indexInter = existingComment.interaction.findIndex(item => item.id === comment.interactionId);
              if (indexInter !== -1) {
                existingComment.interaction.splice(indexInter, 1);
                return [...prePost];
              }
            }
          }
          return prePost;
        });
      });
    }
    socketConnect()
  }, [])

  const MemoizedPost = React.memo(({ post, users, userCurrent }) => (
    <Post key={`${post.id}`} post={post} users={users} userCurrent={userCurrent} style={{ flex: 1 }} />
  ));
  useEffect(() => {
    console.log("HasChange!")
  })
  const flatListRef = useRef(null);
  useEffect(() => {
    flatListRef.current.scrollToOffset({ offset: 0, animated: true });
  }, [dataPost]);

  const VirtualizedView = useMemo(() => {
    return (
      <FlatList
        ref={flatListRef}
        data={dataPost}
        ListEmptyComponent={() => (
          <View style={styles.container}>
            <Text style={styles.text}>Welcome to Black Cat Chat</Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <React.Fragment>
            <Stories post={dataStory} users={dataUser} />
          </React.Fragment>
        )}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => (
          <MemoizedPost post={item} users={dataUser} userCurrent={dataUserCurrent} />
        )}
      />
    );
  }, [dataPost, dataStory, dataUser, dataUserCurrent]); // Add dependencies to the dependency array
  


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
      <Header receivedData={receivedData} />
      <View style={{ flex: 1 }}>
        {VirtualizedView}
      </View>
      <BottomTabs receivedData={receivedData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
});
export default HomeScreen;