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
import LoadingAnimation from "../components/Loading/loadingAnimation";
const ProfileUser = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [receivedData, setReceivedData] = useState(route.params?.data || null);
  const insets = useSafeAreaInsets();
  const [isUser, setIsUser] = useState(true);
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
    gender: "other",
    countryCode: "+84"
  });
  const [dataPost, setDataPost] = useState([]);
  const [dataUser, setDataUser] = useState({});
  const [dataUserCurrent, setDataUserCurrent] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!receivedData) {
        navigation.navigate("main");
        return;
      }
      setIsLoading(true)
      const dataUserLocal = { ...receivedData };

      const keys = await getAllIdUserLocal();
      const dataLocal = await getDataUserLocal(keys[keys.length - 1]);

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
        if (detail.gender) newProfile.gender = detail.gender;
        if (detail.countryCode) newProfile.countryCode = detail.countryCode;
        
      }
      setUserProfile(newProfile);
      if (dataUserLocal.id !== dataLocal.id) setIsUser(false);
      setIsLoading(false)
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
  
  const handleRemovePost = (id) => {
    setDataPost((prevPosts) => prevPosts.filter(item => item.id !== id));
  }

  const handleAddPost = (newPost) => {
    setDataPost((prevPosts) => [...prevPosts, newPost]);
  }
  
  
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
              onRemovePost={handleRemovePost}
              style={{ flex: 1 }} />
          ))}
        </VirtualizedView>
      </View>
      {isLoading  == true && (
        <LoadingAnimation isVisible={isLoading} />
      )}
      <BottomTabs />
    </View>
  );
};
export default ProfileUser;
