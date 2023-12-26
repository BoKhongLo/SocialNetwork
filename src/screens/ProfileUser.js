import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";
import Header from "../components/Profile/Header";
import BottomTabs from "../components/componentsHome/BottomTabs";
import Information from "../components/Profile/Information";
import Edit from "../components/Profile/Edit";

const userpro = {
  username: "danh_1808",
  avt: require("../../assets/img/avt.png"),
  posted: 1,
  follow: 10,
  dangFollow: 14,
};

const ProfileUser = ({ user }) => {
  const insets = useSafeAreaInsets();
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
      <Header user={userpro} />

      <View style={{ flex: 1 }}>
        <ScrollView>
          <Information />
          <Edit />
        </ScrollView>
      </View>
      <BottomTabs />
    </View>
  );
};

export default ProfileUser;
