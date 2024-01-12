import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Animated,
  SafeAreaView,
  RefreshControl,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../components/Home/Header";
import Stories from "../components/Home/Stories";
import BottomTabs from "../components/Home/BottomTabs";
import Post from "../components/Home/Post";
import { useRoute } from "@react-navigation/native"
import { getAllIdUserLocal, getDataUserLocal, updateAccessTokenAsync } from "../util";
const post = [
  {
    username: "danh_1808",
    avt: require("../../assets/img/avt.png"),
    imagepost:{uri: 'https://cdn.discordapp.com/attachments/1192452171795533844/1192452355090829403/20230916_033009226_iOS.jpg?ex=65a920cc&is=6596abcc&hm=3130ad3d8dbb3a91ca6d7eb0b11bd06075d7419a7a71a3689c8e6a8a291feb48&'} ,
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
    imagepost: {uri:'https://cdn.discordapp.com/attachments/1192452171795533844/1192457809250492506/snapedit_1704374457237.png?ex=65a925e0&is=6596b0e0&hm=ad2cb39d627a58bc3ce2bb7bfd4ddd7d1c4e5366db6b18e6553d487c76c329df&'},
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

  useEffect(() => {
    const fetchData = async () => {
      const keys = await getAllIdUserLocal();
      const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
      if (receivedData === null) {
        setReceivedData({ ...dataLocal });
      }
    };

    fetchData();
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
      <Header receivedData={receivedData}/>
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <Stories post={post} />
          {post.map((item, index) => (
            <Post key={`${index}-${item.username}`} post={[item]} style={{ flex: 1 }} />
          ))}
        </ScrollView>
      </View>
      <BottomTabs receivedData={receivedData}
/>
    </View>
  );
};
export default HomeScreen;