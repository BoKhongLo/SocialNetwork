import { View, Text, Image, TouchableOpacity } from "react-native";
import React, {useState, useEffect} from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "../../styles/styles";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useNavigation, CommonActions } from "@react-navigation/native";

import { getUserDataAsync, getAllIdUserLocal, getDataUserLocal, updateAccessTokenAsync, deleteDataUserLocal } from "../../util";

const Setting = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  const [userProfile, setUserProfile] = useState({
    username: "",
    avatarUrl: require("../../../assets/img/avt.png"),
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
      const keys = await getAllIdUserLocal();
      const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);

      const dataUserAsync = await getUserDataAsync(
        dataUserLocal.id,
        dataUserLocal.accessToken
      );

      const newProfile = { ...userProfile };

      if ("errors" in dataUserAsync) {
        const dataUpdate = await updateAccessTokenAsync(dataUserLocal.id, dataUserLocal.refreshToken);
        dataUserLocal.accessToken = dataUpdate.accessToken;
        dataUserAsync = await getUserDataAsync(dataUpdate.id, dataUpdate.accessToken);
      }

      console.log(dataUserAsync)

      if ("errors" in dataUserAsync) {
        navigation.navigate('main');
      }

      const { detail, id } = dataUserAsync;


      newProfile.id = id;

      if (detail) {
        if (detail.name) newProfile.username = detail.name;
        if (detail.avatarUrl ) newProfile.avatarUrl = {uri : detail.avatarUrl};
        if (detail.nickName) newProfile.nickName = detail.nickName;
        if (detail.age) newProfile.age = detail.age;
        if (detail.friend) newProfile.friends = detail.friends;
        if (detail.description) newProfile.description = detail.description;
        else newProfile.description = "..."
        if (detail.phoneNumber) newProfile.phoneNumber = detail.phoneNumber;
        if (detail.birthday) newProfile.birthday = detail.birthday;
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
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
        flex: 1,
      }}
    >
      <Header />
      <General userProfile={userProfile}/>
      <Security/>
    </View>
  );
};

const Header = () => {
  const navigation = useNavigation();
  
  const logoutFunction = async () => {
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    await deleteDataUserLocal(dataUserLocal.id);

    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'Login' },
        ],
      })
    );
  }

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

      <TouchableOpacity
        style={{ padding: 10 }}
        onPress={logoutFunction}
      >
        <Image
          style={{ height: 35, width: 35 }}
          source={require("../../../assets/dummyicon/exit.png")}
        />
      </TouchableOpacity>
    </View>
  );
};
const General = ({userProfile}) => {
  const navigation = useNavigation();

  return (
    <View style={{ marginLeft: 10, marginRight: 15 }}>
      <Text style={{ fontWeight: "400", fontSize: 18, color: "grey" }}>
        General
      </Text>
      <View style={{ marginLeft: 15, marginTop: 20 }}>
        <TouchableOpacity 
          style={{ padding: 10 }}
          onPress={()=> navigation.navigate('editField', {data: userProfile})}
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
          <View
            style={{ height: 0.5, backgroundColor: "black", marginTop: 10 }}
          ></View>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 10 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 18 }}>Contact Us</Text>
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

const Security = () => {
  const navigation = useNavigation();

  return <View style={{ marginLeft: 10, marginRight: 15,marginTop:20 }}>
  <Text style={{ fontWeight: "400", fontSize: 18, color: "grey" }}>
    Security
  </Text>
  <View style={{ marginLeft: 15, marginTop: 20 }}>
    <TouchableOpacity
    onPress={()=> navigation.navigate('changepassword')}
    style={{ padding: 10 }}>
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
</View>
};
export default Setting;
