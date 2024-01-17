import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation, useRoute} from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from '../../styles/styles';
import ToastManager from 'toastify-react-native'

const FillPassword = () => {
  const insets = useSafeAreaInsets()
  const route = useRoute();
  const navigation = useNavigation();
  const receivedData = route.params?.data;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (receivedData == null) {
        navigation.navigate('Login');
      }};
    fetchData();
  }, []);

  const nextStep = async () => {
    if (password == "") return;
    if (password != confirmPassword) return;
    const data = {...receivedData}
    data.password = password
    navigation.navigate('Signup', {data: data});
  }

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 20,
        paddingRight: insets.right + 20,
        flex: 1,
      }}
    >
            <ToastManager  />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          padding: 5,
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("fillEmail")}>
          <Image
            style={{ height: 40, width: 40, padding: 10 }}
            source={require("../../../assets/dummyicon/left_line_64.png")}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "500", marginBottom: 10 }}>
          Sign up
        </Text>
      </View>
      <Text
        style={{
          fontSize: 30,
          fontWeight: "500",
          marginTop: 20,
          marginLeft: 20,
        }}
      >
        Create a Password
      </Text>
      <View style={styles.wrapper}>
        <View style={styles.inputField}>
          <TextInput
            placeholderTextColor="#444"
            placeholder="Mật khẩu"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            textContentType="password"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <View style={styles.inputField}>
          <TextInput
            placeholderTextColor="#444"
            placeholder="Xác nhận mật khẩu"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            textContentType="password"
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
        </View>
      </View>
      <TouchableOpacity
        titleSize={20}
        style={styles.buttonLogin}
        onPress={nextStep}
      >
        <Text style={styles.buttonLoginText}> Next </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FillPassword