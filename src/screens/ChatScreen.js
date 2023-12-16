import { View, Text, SafeAreaView, ScrollView, TouchableHighlight, TouchableOpacity } from "react-native";
import React from "react";
import Chats from "./../components/Chat/Chats";
import Header from "./../components/Chat/Header";
import Search from "./../components/Chat/Search";
import chat from "../styles/chatStyles";

const user = {
  username: "danh_1808",
}



const ChatScreen = () => {
  return (
    <View style={chat.container}>
      <SafeAreaView>
        <Header user={user} />
        <ScrollView>
          <Search />
          <Chats/>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ChatScreen;
