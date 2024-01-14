import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";

import Header from "../components/Profile/Header";
import BottomTabs from "../components/Home/BottomTabs";
import Information from "../components/Profile/Information";
import Options from "../components/Profile/Options";

import {
  getUserDataAsync,
  getAllIdUserLocal,
  getDataUserLocal,
  updateAccessTokenAsync,
} from "../util";
import { useNavigation, useRoute } from "@react-navigation/native";

const ProfileUser = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const receivedData = route.params?.data;
  const insets = useSafeAreaInsets();
  const [isUser, setIsUser ]= useState(false);
  const [userProfile, setUserProfile] = useState({
    username: "",
    avatarUrl: require("../../assets/img/avt.png"),
    posted: 0,
    friends: [],
    nickName: "",
    phoneNumber: -1,
    description: "",
    birthday: "0-0-0",
    age: -1,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (receivedData == null) {
        navigation.navigate("main");
      }
      const dataUserLocal = receivedData;

      const keys = await getAllIdUserLocal();
      const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
      if (dataUserLocal === dataLocal) (setIsUser(true))
      const dataUserAsync = await getUserDataAsync(
        dataUserLocal.id,
        dataUserLocal.accessToken
      );
      const newProfile = { ...userProfile };

      if ("errors" in dataUserAsync) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        dataUserLocal.accessToken = dataUpdate.accessToken;
        dataUserAsync = await getUserDataAsync(
          dataUpdate.id,
          dataUpdate.accessToken
        );
        // newProfile.accessToken = dataUpdate.accessToken;
      }

      console.log(dataUserAsync);

      if ("errors" in dataUserAsync) {
        navigation.navigate("main");
      }

      const { detail, id, friends } = dataUserAsync;

      newProfile.id = id;

      if (detail) {
        if (detail.name) newProfile.username = detail.name;
        if (detail.avatarUrl) newProfile.avatarUrl = { uri: detail.avatarUrl };
        if (detail.nickName) newProfile.nickName = detail.nickName;
        if (detail.age) newProfile.age = detail.age;
        newProfile.friends = friends;
        if (detail.description) newProfile.description = detail.description;
        else newProfile.description = "...";
        if (detail.phoneNumber) newProfile.phoneNumber = detail.phoneNumber;
        if (detail.birthday) newProfile.birthday = detail.birthday;
      }
      console.log(newProfile);
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
        <ScrollView
          style={{
            borderBottomWidth: 0.7,
          }}
        >
          <Information data={userProfile} />
          {isUser && (
            <Options data={userProfile}/>
          )}
        </ScrollView>
      </View>
      <BottomTabs />
    </View>
  );
};
export default ProfileUser;