import { View, Text, Image, Touchable } from "react-native";
import React from "react";
import profileStyle from "../../styles/profileStyles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { deleteDataUserLocal } from "../../util";
const Header = ({ user }) => {
  const navigation = useNavigation();

  const logoutFunction = async (userId) => {
    await deleteDataUserLocal(userId);
    navigation.replace('Login');
  }

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 0.08,
        alignItems:'center'
      }}
    >
      <Text style={profileStyle.userNameStyles}>{user.username}</Text>
      <TouchableOpacity
      style={{padding: 10,}}
      onPress={() => navigation.navigate('main')}>
      <Image
          style={{ height: 25, width: 25 }}
          source={require("../../../assets/dummyicon/filter_2_line.png")}
        />
      </TouchableOpacity>
      <TouchableOpacity
      style={{padding: 10,}}
      onPress={() => logoutFunction(user.id)}>
      <Image
          style={{ height: 25, width: 25 }}
          source={require("../../../assets/dummyicon/filter_2_line.png")}
        />
      </TouchableOpacity>
    </View>
  );
};
export default Header;