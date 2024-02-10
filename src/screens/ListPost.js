import { View, Text, Image, ScrollView, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Divider } from "react-native-elements";
import notistyles from "../styles/notiStyles";
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
  saveDataUserLocal
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

  const handleRemovePost = (id) => {
    setDataPost((prevPosts) => prevPosts.filter(item => item.id !== id));
  }

  const handleAddPost = (newPost) => {
    setDataPost((prevPosts) => [...prevPosts, newPost]);
  }
  
  useEffect(() => {
    const fetchData = async () => {
      if (!("userId" in receivedData)) return;
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
        await saveDataUserLocal(dataUpdate.id, dataUpdate)
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
    const fetchPost = async () => {
      if (!("postId" in receivedData)) return;
      const keys = await getAllIdUserLocal();
      const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
      const dataUserLocal = { ...dataLocal }

      let dataReturn = await getPostAsync(
        receivedData.postId,
        dataUserLocal.accessToken
      );

      if ("errors" in dataReturn) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        await saveDataUserLocal(dataUpdate.id, dataUpdate)
        dataUserLocal.accessToken = dataUpdate.accessToken;
        dataReturn = await getPostAsync(
          receivedData.postId,
          dataUpdate.accessToken,
        );
      }
      let tmpPost = [];
      let tmpUserData = {}
      if (dataReturn.isDisplay == false) return;
      if (dataReturn.type === "POST") {
        let dataUserOwner = await getUserDataLiteAsync(dataReturn.ownerUserId, dataUserLocal.accessToken)
        tmpUserData[dataUserOwner.id] = dataUserOwner;
        for (let comment of dataReturn.comment) {
          if (comment.userId in tmpUserData) continue;
          let dataUserComment = await getUserDataLiteAsync(comment.userId, dataUserLocal.accessToken)
          tmpUserData[dataUserComment.id] = dataUserComment;
        }
        for (let interaction of dataReturn.interaction) {
          if (interaction.userId in tmpUserData) continue;
          let dataUserInteraction = await getUserDataLiteAsync(interaction.userId, dataUserLocal.accessToken)
          tmpUserData[dataUserInteraction.id] = dataUserInteraction;
        }
        if (dataReturn.interaction) {
          dataReturn.interaction = dataReturn.interaction.filter(item => item.isDisplay !== false)
        }
        tmpPost.push(dataReturn);
      }
      console.log(tmpPost);
      setDataUser(tmpUserData);
      setDataPost(tmpPost);
      let dataUserCurrent = await getUserDataAsync(dataUserLocal.id, dataUserLocal.accessToken);
      setDataUserCurrent(dataUserCurrent)
    };

    fetchPost();
  }, []);
  

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
      <Header userId={receivedData.userId} dto={receivedData.dto}/>
      <Divider width={1} orientation="vertical" />
      <VirtualizedView style={{ flex: 1 }}>
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
  );
};

const Header = ({ dto }) => {
  const navigation = useNavigation();
  const handleReBack = async () => {
      const keys = await getAllIdUserLocal();
      const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
      navigation.replace(dto, { data: dataLocal });
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
