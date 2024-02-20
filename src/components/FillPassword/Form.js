import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import forgotPass from "../../styles/forgotPassStyles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Toast } from 'toastify-react-native';
import { ForgetPasswordDto, LoginDto } from './../../util/dto';
import { forgetPasswordValidate, LoginAsync } from "../../util";



const Form = ({receivedData}) => {
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async () => {
    // Validate password
    if (!validatePassword()) {
      Alert.alert("Invalid Password", "Password must have at least 8 characters, one uppercase letter, one lowercase letter, and one digit.");
      return;
    }

    // Validate if passwords match
    if (password !== confirmPassword) {
      Alert.alert("Passwords Do Not Match", "Please make sure the passwords match.");
      return;
    }


    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);

    if (password == "") return;

    const data = { ...receivedData }
    data.password = password
    if (data.type === "SignUp") {
      navigation.replace('Signup', { data: data });
    }
    else if (data.type === "ForgotPassword") {
      const dto = new ForgetPasswordDto(data.email, data.otpId, data.password, data.password);
      const dataRe = await forgetPasswordValidate(dto);
      if ("errors" in dataRe) {
        Toast.error(dataRe.errors[0].message);
        return;
      }
      const dtoLogin = new LoginDto(data.email, data.password);
      try {
        const dataLogin = await LoginAsync(dtoLogin);
        if ("errors" in dataLogin) {
          Toast.error(dataLogin.errors[0].message);
          return;
        }
        if (dataLogin != null && dataLogin != undefined) {
          navigation.navigate("main", { data: dataLogin });
        }
  
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <View style={forgotPass.formContainer}>
      <View>
        <Text style={forgotPass.text}>Enter New Password</Text>
        <View style={forgotPass.textInput}>
          <TextInput
            style={{ fontSize: 18, padding: 18 }}
            placeholder="At least 8 characters"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            onChangeText={handlePasswordChange}
            value={password}
          />
        </View>
      </View>
      <View>
        <Text style={forgotPass.text}>Confirm Password</Text>
        <View style={[forgotPass.textInput,{marginBottom:-10}]}>
          <TextInput
            style={{ fontSize: 18, padding: 18 }}
            placeholder=""
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            onChangeText={handleConfirmPasswordChange}
            value={confirmPassword}
          />
          
        </View>
        <TouchableOpacity
        style={{flexDirection:'row',justifyContent:'flex-end'}} onPress={toggleShowPassword}>
            <Image
              source={
                showPassword
                  ? require("../../../assets/dummyicon/icons8-visible-100.png")
                  : require("../../../assets/dummyicon/icons8-invisible-96.png")
              }
              style={{ width: 20, height: 20, marginTop: 10 }}
            />
          </TouchableOpacity>
      </View>
      
      <TouchableOpacity onPress={handleSubmit} style={forgotPass.buttonNext}>
        <Text style={forgotPass.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Form;
