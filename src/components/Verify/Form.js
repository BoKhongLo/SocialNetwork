import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import forgotPass from "../../styles/forgotPassStyles";
import { ValidateOtpCodeAsync, CreateOtpCodeAsync } from "../../util";
import { Toast } from 'toastify-react-native'

const Form = ({receivedData, setIsLoading}) => {
  const navigation = useNavigation();
  const [verificationCode, setVerificationCode] = useState("");

  const handleSubmit = async() => {
    // Check if the verification code has exactly 6 digits
    if (verificationCode.length < 6) return;
    const dataRe = await ValidateOtpCodeAsync(receivedData.email, verificationCode, receivedData.type)
    if ("errors" in dataRe) {
      Toast.error(dataRe.errors[0].message);
      return;
    }
    if (dataRe.isRequest == false) {
      Toast.error("Request is not allowed!");
      return;
    }
    const dataPass = { ...receivedData }
    console.log(dataRe);
    dataPass.otpId = dataRe.otpId;
    navigation.replace("fillPass", {data: dataPass});
  };

  const handleSetVerificationCode = (text) => {
    if (text == "") {
      setVerificationCode(text);
      return;
    }
    const numberRegex = /^[0-9]+$/;
    if (numberRegex.test(text)) {
      setVerificationCode(text);
    } else {
      return;
    }
  }

  const handleResend = async () => {
    if (!receivedData) return;
    setIsLoading(true); //////////////////////////////////////
    const dataRe = await CreateOtpCodeAsync(receivedData.email, receivedData.type);

    if ("errors" in dataRe) {
      console.log(dataRe)
      Toast.alert(dataRe.errors[0].message);
      setIsLoading(false);
      return;
    }
    if (dataRe.isRequest == false) {
      Toast.error("Request is not allowed!");
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  }

  return (
    <View style={forgotPass.formContainer}>
      <Text style={forgotPass.text}>Enter Verification Code</Text>
      <View style={forgotPass.textInput}>
        <TextInput
          style={{ fontSize: 18, textAlignVertical: "top", }}
          keyboardType="number-pad"
          autoCapitalize="none"
          maxLength={6} // Set maximum length to 6 digits
          value={verificationCode}
          onChangeText={handleSetVerificationCode}
          
          placeholder=""
        />
        
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={{borderBottomWidth:1}}>Check your spam folder</Text>
        <Text>  or  </Text>
        <TouchableOpacity
          onPress={async () => await handleResend()}
        >
          <Text style={{color:'#FF0000'}}>Resend</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleSubmit} style={forgotPass.buttonNext}>
        <Text style={forgotPass.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Form;
