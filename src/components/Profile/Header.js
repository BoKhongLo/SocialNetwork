import { View, Text, Image, Touchable } from "react-native";
import React from "react";
import profileStyle from "../../styles/profileStyles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const Header = ({ user }) => {
  const navigation = useNavigation();

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
      onPress={()=>navigation.navigate('setting', {data: user})}
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