import { View, Text, Image, ScrollView } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Divider } from "react-native-elements";
import notistyles from "../styles/notiStyles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/styles";
import Notify from "../components/Notification/Notify";
import Invite from './../components/notification/Invite';

const NotiScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left +10,
        paddingRight: insets.right +10,
        flex: 1,
      }}
    >
      <Header />
      <Divider width={1} orientation="vertical" />
      <Invite />
      <Notify/>
    </View>
  );
};

const Header = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("main")}>
        <Image
          style={[styles.iconforAll]}
          source={require("../../assets/dummyicon/left_line_64.png")}
        />
      </TouchableOpacity>
      <Text style={notistyles.headerName}> Notify </Text>
    </View>
  );
};

export default NotiScreen;
