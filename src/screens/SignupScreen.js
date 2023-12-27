import { View, Text, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import React from "react";
import styles from "../styles/styles";

import SignupForm from "../components/Signup/SignupForm";
const SignupScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        flex: 1,
      }}
    >
      <View style={styles.logoContainer}>
        <Image
          style={styles.imgLogo}
          source={require("../../assets/img/meoden.png")}
        />
      </View>

      <SignupForm />
    </View>
  );
};

export default SignupScreen;
