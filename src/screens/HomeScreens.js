import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Animated,
  SafeAreaView,
  RefreshControl,
  Image,
  Text,
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

const post = [
  {
    username: "danh_1808",
    avt: require("../../assets/img/avt.png"),
    imagepost: {
      1: {
        uri: 'https://cdn.discordapp.com/attachments/1192452171795533844/1192452355090829403/20230916_033009226_iOS.jpg?ex=65a920cc&is=6596abcc&hm=3130ad3d8dbb3a91ca6d7eb0b11bd06075d7419a7a71a3689c8e6a8a291feb48&'
      },
      2: {
        uri: 'https://cdn.discordapp.com/attachments/1192452171795533844/1192452355090829403/20230916_033009226_iOS.jpg?ex=65a920cc&is=6596abcc&hm=3130ad3d8dbb3a91ca6d7eb0b11bd06075d7419a7a71a3689c8e6a8a291feb48&'
      },
      3: {
        uri: 'https://cdn.discordapp.com/attachments/1192452171795533844/1192452355090829403/20230916_033009226_iOS.jpg?ex=65a920cc&is=6596abcc&hm=3130ad3d8dbb3a91ca6d7eb0b11bd06075d7419a7a71a3689c8e6a8a291feb48&'
      },
    },
    likes: 30,
    captions: "ditmecuocsong !!",
    comments: [
      {
        username: "thang ngu 1",
        comment: "ditmecuocdoi!!!",
      },
      {
        username: "thang ngu 2",
        comment: "ditmecuocdoi!!@@!!@@!@@!!",
      },
    ],
  },
  {
    username: "danh_1808",
    avt: require("../../assets/img/avt.png"),
    imagepost: {
      1: {
        uri: 'https://cdn.discordapp.com/attachments/1192452171795533844/1192452355090829403/20230916_033009226_iOS.jpg?ex=65a920cc&is=6596abcc&hm=3130ad3d8dbb3a91ca6d7eb0b11bd06075d7419a7a71a3689c8e6a8a291feb48&'
      },
      2: {
        uri: 'https://cdn.discordapp.com/attachments/1192452171795533844/1192452355090829403/20230916_033009226_iOS.jpg?ex=65a920cc&is=6596abcc&hm=3130ad3d8dbb3a91ca6d7eb0b11bd06075d7419a7a71a3689c8e6a8a291feb48&'
      },
      3: {
        uri: 'https://cdn.discordapp.com/attachments/1192452171795533844/1192452355090829403/20230916_033009226_iOS.jpg?ex=65a920cc&is=6596abcc&hm=3130ad3d8dbb3a91ca6d7eb0b11bd06075d7419a7a71a3689c8e6a8a291feb48&'
      },
    },
    likes: 3890987,
    captions: "ditmecuocsong !!",
    comments: [
      {
        username: "thang ngu 1",
        comment: "ditmecuocdoi!!!",
      },
      {
        username: "thang ngu 2",
        comment: "ditmecuocdoi!!@@!!@@!@@!!",
      },
    ],
  },
];

const HomeScreen = () => {
  const route = useRoute();
  const [receivedData, setReceivedData] = useState(route.params?.data || null);
  const insets = useSafeAreaInsets();
  const [dataPost, setDataPost] = useState([]);
  const [dataUser, setDataUser] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const keys = await getAllIdUserLocal();
      const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
      const dataUserLocal = {...dataLocal}
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
      let tmpPost = {};
      let tmpUserData = {};
      for (let post of dataReturn) {
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
        }
      }
      setDataUser(tmpUserData);
      console.log(tmpUserData);
      setDataPost(dataReturn);
    };

    fetchData();
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
      <Header receivedData={receivedData}/>
      <View style={{ flex: 1 }}>
        <VirtualizedView style={{ flex: 1 }}>
          <Stories post={post} />
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
export default HomeScreen;