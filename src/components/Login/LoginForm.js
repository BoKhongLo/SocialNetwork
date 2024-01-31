import {
  View,
  Text,
  TextInput,
  Button,
  secureTextEntry,
  Pressable,
  onPress,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState, useRef } from "react";
import styles from "../../styles/styles";
import { LoginDto } from "../../util/dto";
import { LoginAsync, getUserDataAsync } from "../../util";
import { useNavigation } from "@react-navigation/native";
import { Toast } from "toastify-react-native";
import LoadingAnimation from "./../Loading/loadingAnimation";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [isAnimationVisible, setAnimationVisible] = useState(false);
  const animationRef = useRef(null);
  const startAnimation = () => {
    setAnimationVisible(true);

    // Check if animationRef.current is not null before calling play
    if (animationRef.current) {
      animationRef.current.play();
    }
  };
  const stopAnimation = () => {
    // Stop the animation
    animationRef.current.reset();
    setAnimationVisible(false);
  };

  const onAnimationFinish = () => {
    // Callback function when the animation is finished
    stopAnimation();
  };

  const handleForgotPassword = () => {
    navigation.replace("fillEmail", { data: { type: "ForgotPassword" } });
  };
  const handleLogin = async () => {
    if (email === "" || password === "") return;

    if (!email.includes("@")) {
      Toast.error("This is not an email!");
      return;
    }

    startAnimation(); // Start animation when the login button is pressed

    const dto = new LoginDto(email, password);

    try {
      const dataLogin = await LoginAsync(dto);

      if ("errors" in dataLogin) {
        Toast.error(dataLogin.errors[0].message);
        stopAnimation(); // Stop animation on error
        return;
      }

      if (dataLogin != null && dataLogin != undefined) {
        navigation.navigate("main", { data: dataLogin });
        stopAnimation(); // Stop animation on successful login
      }
    } catch (err) {
      console.log(err);
      stopAnimation(); // Stop animation on error
    }
  };

  const handleSignUp = () => {
    navigation.replace("fillEmail", { data: { type: "SignUp" } });
  };

  return (
    <>
    <View>
      <View style={styles.wrapper}>
        <View style={styles.inputField}>
          <TextInput
            placeholderTextColor="#444"
            placeholder="Phone number, Username or Email"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            // autoFocus={true}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        <View style={styles.inputField}>
          <TextInput
            placeholderTextColor="#444"
            placeholder="Password"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        <TouchableOpacity
          titleSize={20}
          style={styles.buttonLogin}
          onPress={() => handleLogin()}
        >
          <Text style={styles.buttonLoginText}>Log in</Text>
        </TouchableOpacity>
        <View
          style={{
            marginTop: 30,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => handleForgotPassword()}
          >
            <Text> Forgot password </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signupContainer}>
          <Text>
            Don't have an account ?
            <TouchableOpacity onPress={() => handleSignUp()}>
              <Text style={{ color: "#6BB0F5" }}> Sign up !!</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    </View>
    
    </>
  );
};

export default LoginForm;
