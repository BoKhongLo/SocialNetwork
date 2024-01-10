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
import Header from "../components/componentsHome/Header";
import Stories from "../components/componentsHome/Stories";
import BottomTabs from "../components/componentsHome/BottomTabs";
import Post from "../components/componentsHome/Post";
import { useRoute } from "@react-navigation/native"
import { getAllIdUserLocal, getDataUserLocal, updateAccessTokenAsync } from "../util";
const post = [
  {
    username: "danh_1808",
    avt: require("../../assets/img/avt.png"),
    imagepost: require("../../assets/img/anhmanhinh.png"),
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
    imagepost: require("../../assets/img/baidang.png"),
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