import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";
import Header from "../components/Profile/Header";

const userpro =
    {
        username: "danh_1808",
        avt: require("../../assets/img/avt.png"),
        posted: 1,
        follow: 10,
        dangFollow: 14
    }

const ProfileUser = ({user}) => {
  const insets = useSafeAreaInsets();
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
        <Header user={userpro}/>
    </View>
  );
};

export default ProfileUser;
