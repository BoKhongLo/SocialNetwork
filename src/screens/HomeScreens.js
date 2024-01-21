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

    };

    fetchData();
    return () => {
      if (socket != undefined) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket === undefined) return;
    socket.on("removePost", (post) => {
      setDataPost((prevPosts) => prevPosts.filter(item => item.id !== post.postId));
    });
    
    socket.on("addComment", (comment) => {
      setDataPost((prevPosts) => {
        return prevPosts.map(item => {
          if (item.id === comment.roomId) {
            return {
              ...item,
              comment: [...item.comment, comment],
            };
          }
          return item;
        });
      });
    });
    
    socket.on("addInteractionPost!", (post) => {
      setDataPost((prevPosts) => {
        const updatedPosts = prevPosts.map(item => {
          if (item.id === post.postId) {
            return {
              ...item,
              interaction: [...item.interaction, post],
            };
          }
          return item;
        });
        return updatedPosts;
      });
    });
    
    socket.on("removeInteractionPost", (post) => {
      setDataPost((prevPosts) => {
        const updatedPosts = prevPosts.map(item => {
          if (item.id === post.postId) {
            return {
              ...item,
              interaction: item.interaction.filter(item => item.id !== post.interactionId),
            };
          }
          return item;
        });
        return updatedPosts;
      });
    });

    socket.on("addInteractionComment", (comment) => {
      setDataPost((prevPosts) => {
        const updatedPosts = prevPosts.map((post) => {
          if (post.id === comment.roomId) {
            const updatedComments = post.comment.map((item) => {
              if (item.id === comment.id) {
                return { ...item, interaction: comment.interaction };
              }
              return item;
            });
            return { ...post, comment: updatedComments };
          }
          return post;
        });
        return updatedPosts;
      });
    });
    
    socket.on("removeInteractionComment", (comment) => {
      setDataPost((prevPosts) => {
        const updatedPosts = prevPosts.map((post) => {
          if (post.id === comment.postId) {
            const updatedComments = post.comment.map((item) => {
              if (item.id === comment.commentId) {
                const updatedInteractions = item.interaction.filter(
                  (interaction) => interaction.id !== comment.interactionId
                );
                return { ...item, interaction: updatedInteractions };
              }
              return item;
            });
            return { ...post, comment: updatedComments };
          }
          return post;
        });
        return updatedPosts;
      });
    });
    
    return () => {
      if (socket != undefined) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const VirtualizedView = useMemo(() => {
    return (props) => (
      <FlatList
        data={[]}
        ListEmptyComponent={null}
        keyExtractor={() => "dummy"}
        renderItem={null}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={() => (
          <React.Fragment>{props.children}</React.Fragment>
        )}
      />
    );
  }, [refreshing, onRefresh]);

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