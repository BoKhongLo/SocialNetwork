import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, {useEffect, useState} from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SignupForm from "../components/Signup/SignupForm";
import ToastManager from 'toastify-react-native'
import LoadingAnimation from "../components/Loading/loadingAnimation";

const SignupScreen = () => {

  const [isLoading, setIsLoading] = useState(false);

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const receivedData = route.params?.data;

  useEffect(() => {
    const fetchData = async () => {
      if (receivedData == null) {
        navigation.navigate('Login');
      }
    };
    fetchData();
  }, []);
  return (
    <>
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
        flex: 1,
      }}
    >
      <ToastManager  />
      <View style={{ flexDirection: "row", justifyContent: "flex-start",padding:5 }}>
        <TouchableOpacity onPress={()=> navigation.navigate('fillPass', {data: receivedData})}>
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
        <SignupForm  receivedData={receivedData} isLoading={isLoading} setIsLoading={setIsLoading}/>
      </ScrollView>
      <LoadingAnimation isVisible={isLoading}/>
    </View>
    </>
  );
};

export default SignupScreen;