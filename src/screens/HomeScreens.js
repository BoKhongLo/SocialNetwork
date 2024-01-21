import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  getSocketIO
} from "../util";
import { registerIndieID, unregisterIndieDevice } from 'native-notify';

const HomeScreen = () => {
  const route = useRoute();
  const [receivedData, setReceivedData] = useState(route.params?.data || null);
  const insets = useSafeAreaInsets();
  const [dataPost, setDataPost] = useState([]);
  const [dataStory, setDataStory] = useState([]);
  const [dataUser, setDataUser] = useState({});
  const [socket, setSocket] = useState(undefined);

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
      const newSocket = await getSocketIO(dataUserLocal.accessToken);
      setSocket(newSocket);
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

      newSocket.on("removePost", (post) => {
        setDataPost((prevPosts) => prevPosts.filter(item => item.id !== post.postId));
      });
      
      newSocket.on("addComment", async (comment) => {
        setDataPost( prePost => {
          for (let i = 0; i < prePost.length; i++) {
            if (prePost[i].id === comment.roomId) {
              prePost[i].comment.push(comment);
              break;
            }
          }
          return prePost;
        })
      });
      
      newSocket.on("addInteractionPost!", (post) => {
        setDataPost((prePost) => {
          console.log(post);
          for (let i = 0; i < prePost.length; i++) {
            if (prePost[i].id === post.postId) {
              prePost[i].interaction.push(post);;
              console.log(prePost[i].interaction);
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
          const indexInter =prePost[indexPost].comment[indexComment].interaction.findIndex(item => item.id ==comment.interactionId);
          if (indexInter === -1) return prePost;
          prePost[indexPost].comment[indexComment].interaction.splice(indexInter, 1)
          return prePost;
        });
      });
    };

    fetchData();
    return () => {
      if (socket != undefined) {
        socket.disconnect();
      }
    };
  }, []);


  const VirtualizedView = useMemo(() => {
    return (props) => (
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
  }, []);

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
      <View 
        style={{ flex: 1 }}
      >
      {dataPost.length == 0 && dataStory.length == 0 && (
        <View style={styles.container}>
          <Text style={styles.text}>Welcome to Black Cat Chat</Text>
        </View>
      )}
        <VirtualizedView style={{ flex: 1 }}>
          <Stories post={dataStory} users={dataUser} />
          {dataPost.map((item, index) => (
            <Post
              key={`${item.id}${index}`}
              post={item}
              users={dataUser}
              style={{ flex: 1 }} />
          ))}
        </VirtualizedView>

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