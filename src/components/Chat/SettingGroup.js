import { View, Text } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "./SettingChat/Header";
import Edit from "./SettingGroupChat/Edit";
import Infor from "./SettingChat/Infor";

const SettingGroupChat = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
        flex:1,
        backgroundColor:'white'
      }}
    >
      <Header/>
      <Infor/>
      <Edit/>
    </View>
  );
};

export default SettingGroupChat;