import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard
} from "react-native";
import React, { useState } from "react";
import forgotPass from "../../styles/forgotPassStyles";
import { useNavigation } from "@react-navigation/native";
import { CreateOtpCodeAsync } from "../../util";
import { Toast } from "toastify-react-native";

const Form = ({ receivedData, isLoading, setIsLoading }) => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    console.log("data: ", email);
    if (email == "") return;
    if (!email.includes("@")) {
      Toast.error("Please check your email");
      return;
    }
    if (!receivedData) {
      return;
    }
    setIsLoading(true); //////////////////////////////////////

    const data = { ...receivedData };
    const dataRe = await CreateOtpCodeAsync(email, data.type);

    if ("errors" in dataRe) {
      console.log(dataRe)
      Alert.alert(dataRe.errors[0].message);
      setIsLoading(false);
      return;
    }
    if (dataRe.isRequest == false) {
      Toast.error("Request is not allowed!");
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    data.email = email;
    navigation.replace("verify", { data: data });
  };

  return (
    <View style={forgotPass.formContainer}>
      <Text style={forgotPass.text}>Enter Email Address.</Text>
      <View style={forgotPass.textInput}>
        <TextInput
          style={{ fontSize: 18 }}
          placeholder="example@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={handleEmailChange}
          value={email}
        />
      </View>
      <TouchableOpacity
        onPress={ () => [ handleSubmit(),]}
        style={forgotPass.buttonNext}
      >
        <Text style={forgotPass.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Form;
