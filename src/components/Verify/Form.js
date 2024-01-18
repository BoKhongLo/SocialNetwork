import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import forgotPass from "../../styles/forgotPassStyles";

const Form = () => {
  const navigation = useNavigation();
  const [verificationCode, setVerificationCode] = useState("");

  const handleSubmit = () => {
    // Check if the verification code has exactly 6 digits
    if (/^\d{6}$/.test(verificationCode)) {
      navigation.navigate("newPass");
    }
  };

  return (
    <View style={forgotPass.formContainer}>
      <Text style={forgotPass.text}>Enter Verification Code</Text>
      <View style={forgotPass.textInput}>
        <TextInput
          style={{ fontSize: 18 }}
          keyboardType="number-pad"
          autoCapitalize="none"
          maxLength={6} // Set maximum length to 6 digits
          value={verificationCode}
          onChangeText={(text) => setVerificationCode(text)}
          placeholder=""
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text>Didn't receive a code? </Text>
        <TouchableOpacity>
          <Text>Resend</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleSubmit} style={forgotPass.buttonNext}>
        <Text style={forgotPass.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Form;
