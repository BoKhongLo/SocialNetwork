import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import React, {useState} from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "../../styles/styles";
import ToastManager from 'toastify-react-native'
import { Toast } from 'toastify-react-native'
import { CreateOtpCodeAsync } from "../../util";

const FillEmail = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation();
  const receivedData = route.params?.data;
  const [email, setEmail] = useState("");

  const nextStep = async () => {
    console.log("data: " ,email)
    if (email == "") return;
    if (!email.includes("@")) {
      Toast.error("This is a not email!");
      return;
    };
    if (!receivedData) {
      return;
    }
    const data = { ...receivedData }
    data.email = email;
    navigation.replace('verify', {data: data});
    return;
    const dataRe = await CreateOtpCodeAsync(email, "SignUp")
    if ("errors" in dataRe) {
      Toast.error(dataRe.errors[0].message);
      return;
    }
    if (dataRe.isRequest == false) {
      Toast.error("Request is not allowed!");
      return;
    }
    navigation.navigate('verify', {data: data});
  }

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 20,
        paddingRight: insets.right + 20,
        flex: 1,
      }}
    >
      <ToastManager  />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          // padding: 5,
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Image
            style={{ height: 40, width: 40, padding: 10 }}
            source={require("../../../assets/dummyicon/left_line_64.png")}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "500", marginBottom: 2 }}>
          {receivedData.type === "SignUp" ? "Sign Up" : receivedData.type === "ForgotPassword" && "Forgot Password"}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 30,
          fontWeight: "500",
          marginTop: 20,
          marginLeft: 20,
        }}
      >
        What's your email ?
      </Text>
      <View style={styles.wrapper}>
        <View style={styles.inputField}>
          <TextInput
            placeholderTextColor="#444"
            placeholder="example@gmail.com"
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
            autoFocus={true}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
      </View>
      <TouchableOpacity
        titleSize={20}
        style={styles.buttonLogin}
        onPress={nextStep}
      >
        <Text style={styles.buttonLoginText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FillEmail;
