import { View, Text, Image, TouchableOpacity, Alert, Linking } from "react-native";
import React, { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useNavigation, CommonActions } from "@react-navigation/native";
import {
  getUserDataAsync,
  getAllIdUserLocal,
  getDataUserLocal,
  updateAccessTokenAsync,
  deleteDataUserLocal,
} from "../../util";

const Setting = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [userProfile, setUserProfile] = useState({
    username: "",
    avatarUrl: require("../../../assets/img/avt.png"),
    nickName: "",
    phoneNumber: -1,
    description: "",
    birthday: "0-0-0",
    age: -1,
    gender: "other",
    countryCode: "+84"
  });

  useEffect(() => {
    const fetchData = async () => {
      const keys = await getAllIdUserLocal();
      const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);

      let dataUserAsync = await getUserDataAsync(
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
      }

      console.log(dataUserAsync);

      if ("errors" in dataUserAsync) {
        navigation.navigate("main");
      }

      const { detail, id } = dataUserAsync;

      newProfile.id = id;

      if (detail) {
        if (detail.name) newProfile.username = detail.name;
        if (detail.avatarUrl) newProfile.avatarUrl = { uri: detail.avatarUrl };
        if (detail.nickName) newProfile.nickName = detail.nickName;
        if (detail.age) newProfile.age = detail.age;
        if (detail.description) newProfile.description = detail.description;
        else newProfile.description = "...";
        if (detail.phoneNumber) newProfile.phoneNumber = detail.phoneNumber;
        if (detail.birthday) newProfile.birthday = detail.birthday;
        if (detail.gender) newProfile.gender = detail.gender;
        if (detail.countryCode) newProfile.countryCode = detail.countryCode;
      }

      setUserProfile(newProfile);
    };

    fetchData();
  }, []);

  const logoutFunction = async () => {
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);

    await deleteDataUserLocal(dataUserLocal.id);
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "Login" }],
      })
    );
  };

  const LogoutAlert = () => {
    Alert.alert("", "Log out of your account ?", [
      { text: "Cancel", onPress: () => null },
      { text: "Ok", onPress: () => logoutFunction() },
    ]);
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
        flex: 1,
      }}
    >
      <Header />
      <View
        style={{
          backgroundColor: "#E0E0E0",
          borderRadius: 10,
          elevation: 8,
          marginVertical: 20,
          paddingBottom:10
        }}
      >
        <General userProfile={userProfile} />
      </View>
      <View
        style={{
          backgroundColor: "#E0E0E0",
          borderRadius: 10,
          elevation: 8,
          marginVertical: 20,
          paddingBottom:10
        }}
      >
        <Security logoutFunction={LogoutAlert} />
      </View>
    </View>
  );
};

const Header = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        height: heightPercentageToDP("10%"),
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("Profile")}
        style={{ padding: 10 }}
      >
        <Image
          style={{ height: 40, width: 40 }}
          source={require("../../../assets/dummyicon/left_line_64.png")}
        />
      </TouchableOpacity>

      <Text style={{ fontSize: 20, fontWeight: "500" }}>Settings</Text>

      <TouchableOpacity style={{ padding: 10 }} onPress={null}>
        <Image style={{ height: 35, width: 35 }} source={null} />
      </TouchableOpacity>
    </View>
  );
};
const General = ({ userProfile }) => {
  const navigation = useNavigation();

  return (
    <View style={{ marginLeft: 10, marginRight: 15 }}>
      <Text style={{ fontWeight: "400", fontSize: 18, color: "grey" }}>
        General
      </Text>
      <View style={{ marginLeft: 15, marginTop: 20 }}>
        <TouchableOpacity
          style={{ padding: 10, borderBottomWidth: 0.5, marginVertical: 10 }}
          onPress={() =>
            navigation.replace("editField", { data: userProfile })
          }
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 18 }}>My Profile</Text>
            <Image
              style={{ height: 30, width: 30 }}
              source={require("../../../assets/dummyicon/right_line.png")}
            />
          </View>
        </TouchableOpacity>


        <TouchableOpacity
          style={{ padding: 10, borderBottomWidth: 0.5, marginVertical: 10 }}
          onPress={() =>
            navigation.replace("genderAndPhone", { data: userProfile })
          }
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 18 }}>Gender and phone number</Text>
            <Image
              style={{ height: 30, width: 30 }}
              source={require("../../../assets/dummyicon/right_line.png")}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("buyPremium")}
          style={{ padding: 10, borderBottomWidth: 0.5, marginVertical: 10 }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 18 }}>Buy Premium</Text>
            <Image
              style={{ height: 30, width: 30 }}
              source={require("../../../assets/dummyicon/right_line.png")}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ padding: 10, borderBottomWidth: 0.5, marginVertical: 10 }}
          onPress={() => navigation.navigate("contactUs")}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 18 }}>Contact Us</Text>
            <Image
              style={{ height: 30, width: 30 }}
              source={require("../../../assets/dummyicon/right_line.png")}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Security = ({ logoutFunction }) => {
  const navigation = useNavigation();

  return (
    <View style={{ marginLeft: 10, marginRight: 15, marginTop: 20 }}>
      <Text style={{ fontWeight: "400", fontSize: 18, color: "grey" }}>
        Security
      </Text>
      <View style={{ marginLeft: 15, marginTop: 20 }}>
        <TouchableOpacity
          onPress={() => {Linking.openURL("http://www.blackcatstudio.site/#/privacy")}}
          style={{ padding: 10 }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 18 }}>Privacy policy</Text>
            <Image
              style={{ height: 30, width: 30 }}
              source={require("../../../assets/dummyicon/right_line.png")}
            />
          </View>
          <View
            style={{ height: 0.5, backgroundColor: "black", marginTop: 10 }}
          ></View>
        </TouchableOpacity>
      </View>
      <View style={{ marginLeft: 15, marginTop: 20 }}>
        <TouchableOpacity
          onPress={() => navigation.replace("changepassword")}
          style={{ padding: 10 }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 18 }}>Change Password</Text>
            <Image
              style={{ height: 30, width: 30 }}
              source={require("../../../assets/dummyicon/right_line.png")}
            />
          </View>
          <View
            style={{ height: 0.5, backgroundColor: "black", marginTop: 10 }}
          ></View>
        </TouchableOpacity>
      </View>
      <View style={{ marginLeft: 15, marginTop: 20 }}>
        <TouchableOpacity style={{ padding: 10 }} onPress={logoutFunction}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 18 }}>Log out</Text>
            <Image
              style={{ height: 30, width: 30 }}
              source={require("../../../assets/dummyicon/right_line.png")}
            />
          </View>
          <View
            style={{ height: 0.5, backgroundColor: "black", marginTop: 10 }}
          ></View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Setting;
