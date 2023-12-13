import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Animated,
  SafeAreaView,
  RefreshControl,
  Image,
} from "react-native";
import Header from "../components/componentsHome/Header";
import Stories from "../components/componentsHome/Stories";
import BottomTabs from "../components/componentsHome/BottomTabs";
import Post from "../components/componentsHome/Post";

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
  {
    username: "danh_1808",
    avt: require("../../assets/img/avt.png"),
    imagepost: require("../../assets/img/baidang.png"),
    likes: 387553231234560,
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
    likes: 88765453,
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

];

const HomeScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <Stories post={post} />
          {post.map((item, index) => (
            <Post key={index} post={[item]} style={{ flex: 1 }} />
          ))}
        </ScrollView>
      </View>
      <BottomTabs />
    </SafeAreaView>
  );
};

export default HomeScreen;
