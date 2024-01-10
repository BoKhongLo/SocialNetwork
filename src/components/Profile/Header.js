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
      <Text style={profileStyle.userNameStyles}>Profile</Text>

      <TouchableOpacity
      style={{padding: 10,}}
      // onPress={() => logoutFunction(user.id)}
      onPress={()=>navigation.navigate('setting')}
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