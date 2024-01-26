import { View, Text, ScrollView, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import Header from "../components/Profile/Header";
import BottomTabs from "../components/Home/BottomTabs";
import Information from "../components/Profile/Information";
import Options from "../components/Profile/Options";
import Post from "../components/Home/Post";
import {
  getUserDataAsync,
  getAllIdUserLocal,
  getDataUserLocal,
  updateAccessTokenAsync,
  getAllPostUserAsync,
  getSocketIO,
  getUserDataLiteAsync
} from "../util";
import { useNavigation, useRoute } from "@react-navigation/native";

const ProfileUser = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [receivedData, setReceivedData] = useState(route.params?.data || null);
  const insets = useSafeAreaInsets();
  const [isUser, setIsUser] = useState(false);
  const [userProfile, setUserProfile] = useState({
    username: "",
    avatarUrl: require('../../assets/img/avt.png'),
    bookMarks: [],
    friends: [],
    nickName: "",
    phoneNumber: -1,
    description: "",
    birthday: "0-0-0",
    age: -1,
  });
  const [dataPost, setDataPost] = useState([]);
  const [dataUser, setDataUser] = useState({});
  const [dataUserCurrent, setDataUserCurrent] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!receivedData) {
        navigation.navigate("main");
        return;
      }
      const dataUserLocal = { ...receivedData };

      const keys = await getAllIdUserLocal();
      const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
      if (dataUserLocal.id === dataLocal.id) setIsUser(true);

      let dataUserAsync = await getUserDataAsync(
        dataUserLocal.id,
        dataUserLocal.accessToken
      );

      if ("errors" in dataUserAsync) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        dataUserLocal.accessToken = dataUpdate.accessToken;
        dataUserAsync = await getUserDataAsync(
          dataUpdate.id,
          dataUpdate.accessToken
        );
      }
      console.log(dataUserAsync)
      if ("errors" in dataUserAsync) {
        navigation.navigate("main");
        return;
      }

      const { detail, id, friends, bookMarks } = dataUserAsync;
      const newProfile = { ...userProfile, id };

      if (detail) {
        if (detail.name) newProfile.username = detail.name;
        if (detail.avatarUrl) newProfile.avatarUrl = { uri: detail.avatarUrl };
        if (detail.nickName) newProfile.nickName = detail.nickName;
        if (detail.age) newProfile.age = detail.age;
        newProfile.friends = friends;
        newProfile.bookMarks = bookMarks;
        if (detail.description) newProfile.description = detail.description;
        else newProfile.description = "...";
        if (detail.phoneNumber) newProfile.phoneNumber = detail.phoneNumber;
        if (detail.birthday) newProfile.birthday = detail.birthday;
        
      }
      setUserProfile(newProfile);
    };

    fetchData();
  }, [receivedData, navigation]);

  useEffect(() => {
    const fetchData = async () => {
      if (!receivedData) {
        navigation.navigate("main");
        return;
      }
      const dataUserLocal = { ...receivedData };

      let dataReturn = await getAllPostUserAsync(
        dataUserLocal.id,
        dataUserLocal.accessToken
      );

      if ("errors" in dataReturn) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        dataUserLocal.accessToken = dataUpdate.accessToken;
        dataReturn = await getAllPostUserAsync(
          dataUserLocal.id,
          dataUpdate.accessToken
        );
      }

      let tmpPost = [];
      let tmpUserData = {};
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
        marginLeft: 10,
        marginRight: 10,
      }}
    >
      <Header user={userProfile} />
      <View style={{ flex: 1 }}>
        <VirtualizedView style={{ flex: 1 }}>
          <View
            style={{
              borderBottomWidth: 0.7,
            }}>
            <Information data={userProfile} isUser={isUser}/>
            {!isUser && (
              <Options data={userProfile} />
            )}
          </View>
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
      <BottomTabs />
    </View>
  );
};
export default ProfileUser;
