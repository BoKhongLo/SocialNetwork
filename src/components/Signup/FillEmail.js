import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "../../styles/styles";

const FillEmail = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          padding: 5,
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
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
        What's your email ?
      </Text>
      <TouchableOpacity
        titleSize={20}
        style={styles.buttonLogin}
        onPress={() => navigation.navigate('fillPass')}
      >
        <Text style={styles.buttonLoginText}> Next </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FillEmail;
