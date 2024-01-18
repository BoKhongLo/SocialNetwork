import { View, Text } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../components/ForgotPass/Header";
import Form from "../components/ForgotPass/Form";
import ToastManager from 'toastify-react-native'

const ForgotPassScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
      }}
    >
      <ToastManager  />
      <Header />
      <Form />
    </View>
  );
};

export default ForgotPassScreen;
