import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState } from "react";
import forgotPass from "../../styles/forgotPassStyles";
import { useNavigation } from "@react-navigation/native";

const Form = () => {
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

  const handleSubmit = () => {
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

    // Handle submission logic here
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);

    // Example: Navigate to the 'verify' screen
    navigation.navigate("verify");
  };

  return (
    <View style={forgotPass.formContainer}>
      <View>
        <Text style={forgotPass.text}>Enter New Password</Text>
        <View style={forgotPass.textInput}>
          <TextInput
            style={{ fontSize: 18 }}
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
            style={{ fontSize: 18 }}
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
