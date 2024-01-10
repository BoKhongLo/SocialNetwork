import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "../../styles/styles";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";

const Setting = () => {
  const insets = useSafeAreaInsets();

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
      <General />
      <Security/>
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

      <TouchableOpacity
        style={{ padding: 10 }}
      >
        <Image
          style={{ height: 35, width: 35 }}
          source={require("../../../assets/dummyicon/exit.png")}
        />
      </TouchableOpacity>
    </View>
  );
};
const General = () => {
  const navigation = useNavigation();

  return (
    <View style={{ marginLeft: 10, marginRight: 15 }}>
      <Text style={{ fontWeight: "400", fontSize: 18, color: "grey" }}>
        General
      </Text>
      <View style={{ marginLeft: 15, marginTop: 20 }}>
        <TouchableOpacity style={{ padding: 10 }}>
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
