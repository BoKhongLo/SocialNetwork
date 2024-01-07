import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import Header from "../components/Profile/Header";
import BottomTabs from "../components/componentsHome/BottomTabs";
import Information from "../components/Profile/Information";
import Edit from "../components/Profile/Edit";
import { useRoute } from "@react-navigation/native"
import { getUserDataAsync, getAllIdUserLocal, getDataUserLocal, updateAccessTokenAsync } from "../util";
import { useNavigation } from '@react-navigation/native';

const ProfileUser = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const receivedData = route.params?.data;
  const insets = useSafeAreaInsets();

  // Sử dụng useState để cập nhật thông tin người dùng
  const [userProfile, setUserProfile] = useState({
    username: "đập đá",
    avt: require("../../assets/img/avt.png"),
    posted: 0,
    friends: [],
    nickName: "nickname",
    phoneNumber: -1,
    description: "thisck đập đá",
    age: -1,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (receivedData == null) {
        navigation.navigate('main');
      }
      const dataUserLocal = receivedData;

      const dataUserAsync = await getUserDataAsync(
        dataUserLocal.id,
        dataUserLocal.accessToken
      );
      if (dataUserAsync == null) {
        const dataUpdate = await updateAccessTokenAsync(dataUserLocal.id, dataUserLocal.refreshToken)
        dataUserAsync = await getUserDataAsync(dataUpdate.id, dataUpdate.accessToken)
      }
      console.log(dataUserAsync)
      if (dataUserAsync == null) {
        navigation.navigate('main');
      }

      const { detail, id } = dataUserAsync.getUser;
      const newProfile = { ...userProfile };
      if (detail) {
        if (detail.name) newProfile.username = detail.name;
        if (detail.avatarUrl) newProfile.avt = { uri: detail.avatarUrl };
        if (detail.nickName) newProfile.nickName = detail.nickName;
        if (detail.age) newProfile.age = detail.age;
        if (detail.friend) newProfile.friends = detail.friends;
        if (detail.description) newProfile.description = detail.description;
        else newProfile.description = "..."
        if (detail.phoneNumber) newProfile.phoneNumber = detail.phoneNumber;
      }

      setUserProfile(newProfile);
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
        marginLeft: 10,
        marginRight: 10,
      }}
    >
      <Header user={userProfile} />
      <View style={{ flex: 1 }}>
        <ScrollView>
          <Information data={userProfile} />
          <Edit data={userProfile} />
        </ScrollView>
      </View>
      <BottomTabs />
    </View>
  );
};

export default ProfileUser;