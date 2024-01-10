import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Button,
  TextInput
} from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import profileStyle from "../../styles/profileStyles";

const ChangePassword = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 15,
        paddingRight: insets.right + 15,
        flex: 1,
      }}
    >
      <Header />
      <Form/>
    </View>
  );
};
const Header = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: "row",
        height: heightPercentageToDP("10%"),
        alignItems: "center",}}>
      <TouchableOpacity
        onPress={() => navigation.navigate("setting")}
        style={{ padding: 10 }}>
        <Image
          style={{ height: 40, width: 40 }}
          source={require("../../../assets/dummyicon/left_line_64.png")}/>
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: "500" }}>Change Password</Text>
    </View>
  );
};
const Form = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = () => {
    // Đặt xử lý thay đổi mật khẩu ở đây
    // Ví dụ: kiểm tra mật khẩu cũ, kiểm tra xác nhận mật khẩu mới, sau đó thực hiện thay đổi mật khẩu
  };

  return (
    <View style={profileStyle.container}>
      <TextInput
        style={profileStyle.input}
        placeholder="Current Password"
        secureTextEntry
        value={oldPassword}
        onChangeText={(text) => setOldPassword(text)}
      />
      <TextInput
        style={profileStyle.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={(text) => setNewPassword(text)}
      />
      <TextInput
        style={profileStyle.input}
        placeholder="Confirm"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      <TouchableOpacity
      style={profileStyle.buttonContainer} titleSize={20}>
        <Text style={profileStyle.buttonText}>Change</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 80,
    justifyContent:'center',
    marginLeft:10,
    marginRight:10
  },
  input: {
    borderRadius: 4,
    padding: 15,
    marginBottom: 10,
    borderBottomWidth:0.5,
    marginTop: 10,
  },
  buttonText : {
    fontWeight: "500",
    color: "#fff",
    fontSize: 20,
    padding: 18,
  },
  buttonContainer:{
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    borderRadius: 40,
    marginTop:25,
  }
});

export default ChangePassword;
