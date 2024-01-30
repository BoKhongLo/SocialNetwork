import { View, Text, Image, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import forgotPass from "../../styles/forgotPassStyles";
import { useNavigation } from "@react-navigation/native";
import { CreateOtpCodeAsync } from "../../util";
import { Toast } from 'toastify-react-native'

const Form = ({receivedData}) => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handleSubmit = async () => {
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
    const dataRe = await CreateOtpCodeAsync(email, data.type)
    if ("errors" in dataRe) {
      Alert.alert(dataRe.errors[0].message);
      return;
    }
    if (dataRe.isRequest == false) {
      Toast.error("Request is not allowed!");
      return;
    }
    data.email = email;
    navigation.replace('verify', {data: data});
  };

  return (
    <View style={forgotPass.formContainer}>
      <Text style={forgotPass.text}>Enter Email Address.</Text>
      <View style={forgotPass.textInput}>
        <TextInput
        style={{fontSize:18}}
          placeholder="example@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={handleEmailChange}
          value={email}
        />
      </View>
      <TouchableOpacity
      onPress={handleSubmit}
      style={forgotPass.buttonNext}>
        <Text style={forgotPass.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Form;
