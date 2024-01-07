import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Divider } from "react-native-elements";
import { useNavigation } from '@react-navigation/native';

import chatStyles from "./../../styles/chatStyles";
import chat from "./../../styles/chatStyles";
import { color } from 'react-native-elements/dist/helpers';
import styles from "../../styles/styles";

const Header = ({ user }) => {
  const navigation = useNavigation();
  return (
    <View>
      <View style={chatStyles.headerContainer}>
        <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
          <TouchableOpacity onPress={() => navigation.navigate('main')}>
            <Image
            style={styles.iconforAll}
              source={require("../../../assets/dummyicon/left_line_64.png")}
            />
          </TouchableOpacity>
          <Text style={chatStyles.userNameStyles}> {user.username} </Text>
        </View>
        <View>
          <TouchableOpacity>
            <Image
              style={chat.createIcon}
              source={require("../../../assets/dummyicon/newdot_line.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Divider width={1} orientation="vertical" />
    </View>
  );
};

export default Header;
