import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import profileStyle from "../../styles/profileStyles";
import { useNavigation } from "@react-navigation/native";
import styles from './../../styles/styles';

const Header = ({ user }) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 0.08,
        alignItems:'center',
        marginLeft: 10,
        marginRight: 10,
      }}
    >
      <Text style={profileStyle.userNameStyles}>Profile</Text>

      <TouchableOpacity
      style={{padding: 10,}}
      onPress={()=>navigation.replace('setting')}
      >
      <Image
          style={{ height: 35, width: 35 }}
          source={require("../../../assets/dummyicon/setting.png")}
        />
      </TouchableOpacity>
    </View>
  );
};
export default Header;