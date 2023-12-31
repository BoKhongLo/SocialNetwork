import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import styles from "../styles/styles";
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SignupForm from "../components/Signup/SignupForm";

const SignupScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
        flex: 1,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "flex-start",padding:5 }}>
        <TouchableOpacity onPress={()=> navigation.navigate('Login')}>
          <Image
            style={{ height: 40, width: 40, padding:10 }}
            source={require("../../assets/dummyicon/left_line_64.png")}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 30, fontWeight: "500", marginBottom: 10 }}>
          Create Account
        </Text>
      </View>

      <ScrollView>
        <SignupForm />
      </ScrollView>
    </View>
  );
};

export default SignupScreen;