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
import { ChangePasswordDto } from "../../util/dto";
import { getDataUserLocal, getAllIdUserLocal, changePasswordAsync } from "../../util";


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
  const navigation = useNavigation();

  const handlePasswordChange = async () => {
    if (newPassword != confirmPassword) return;
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    const dto = new ChangePasswordDto(dataUserLocal.id, oldPassword, newPassword, confirmPassword);
    const dataRe = await changePasswordAsync(dto, dataUserLocal.accessToken)
    if ("errors" in dataRe) {
      const dataUpdate = await updateAccessTokenAsync(dataUserLocal.id, dataUserLocal.refreshToken)
      dataRe = await changePasswordAsync(dto, dataUpdate.accessToken)
      if ("errors" in dataRe) return
      navigation.navigate("main")
    }
    else {
      navigation.navigate("main")
    }

   
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
        style={profileStyle.buttonContainer} 
        titleSize={20}
        onPress={handlePasswordChange}
      >
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
