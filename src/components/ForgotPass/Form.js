import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import forgotPass from "../../styles/forgotPassStyles";
import { useNavigation } from "@react-navigation/native";
const Form = () => {
    const navigation = useNavigation();

  const [email, setEmail] = useState("");

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handleSubmit = () => {
    // Xử lý khi người dùng nhấn nút gửi
    console.log("Email:", email);
    // Thêm logic xử lý email ở đây
    navigation.navigate('verify')
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
