import { View, Text, Image } from "react-native";
import React from "react";
import { Divider } from "react-native-elements";

import chatStyles from "./../../styles/chatStyles";
import chat from "./../../styles/chatStyles";

const Header = ({ user }) => {
  return (
    <View>
      <View style={chatStyles.headerContainer}>
        <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
          <Image
            source={require("../../../assets/dummyicon/icons8-back-30.png")}
          />
          <Text style={chatStyles.userNameStyles}> {user.username} </Text>
        </View>
        <View>
          <Image
            style={chat.createIcon}
            source={require("../../../assets/dummyicon/icons8-create-24.png")}
          />
        </View>
      </View>
      <Divider width={1} orientation="vertical" />
    </View>
  );
};

export default Header;
