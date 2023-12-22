import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";
import Chats from "./../components/Chat/Chats";
import Header from "./../components/Chat/Header";
import Search from "./../components/Chat/Search";
import chat from "../styles/chatStyles";

const user = {
  username: "danh_1808",
};

const ChatScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={chat.container}>
      <View
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        <Header user={user} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <Search />
          <Chats />
        </ScrollView>
      </View>
    </View>
  );
};

export default ChatScreen;
