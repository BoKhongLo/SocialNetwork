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
  getUserDataAsync,
  saveDataUserLocal
} from "../util";
import LoadingAnimation from "../components/Loading/loadingAnimation";
const HomeScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const [receivedData, setReceivedData] = useState(route.params?.data || null);
  const insets = useSafeAreaInsets();
  const [dataPost, setDataPost] = useState([]);
  const [dataStory, setDataStory] = useState([]);
  const [dataUser, setDataUser] = useState({});
  const [dataUserCurrent, setDataUserCurrent] = useState({});

  function removeDuplicates(array, key) {
    return array.filter((item, index, self) =>
        index === self.findIndex((t) => (
            t[key] === item[key]
        ))
    );
  }

  const handleRemovePost = (id) => {
    setDataPost((prevPosts) => prevPosts.filter(item => item.id !== id));
  }

  const handleAddPost = (newPost) => {
    setDataPost((prevPosts) => [...prevPosts, newPost]);
  }
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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
        await saveDataUserLocal(dataUpdate.id, dataUpdate)
        dataUserLocal.accessToken = dataUpdate.accessToken;
        dataReturn = await getPostDailyAsync(
          dataUserLocal.id,
          dataUpdate.accessToken
        );
      }
      if ("errors" in dataReturn) {
        setIsLoading(false);
        return
      }
      dataReturn = removeDuplicates(dataReturn, "id");
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
      setIsLoading(false)
      setDataUser(tmpUserData);
      setDataPost(tmpPost);
      setDataStory(tmpStory);
      let dataUserCurrent = await getUserDataAsync(dataUserLocal.id, dataUserLocal.accessToken);
      setDataUserCurrent(dataUserCurrent)
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("HasChange!")
  })

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
      <Header receivedData={receivedData} />
      <View style={{ flex: 1 }}>

        <VirtualizedView style={{ flex: 1 }}>
          <Stories post={dataStory} users={dataUser} />
          {dataPost.map((item, index) => (
            <Post
              key={`${item.id}`}
              post={item}
              users={dataUser}
              userCurrent={dataUserCurrent}
              onRemovePost={handleRemovePost}
              style={{ flex: 1 }} />
          ))}
        </VirtualizedView>
        
      </View>
      {isLoading  == true && (
        <LoadingAnimation isVisible={isLoading} />
      )}
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