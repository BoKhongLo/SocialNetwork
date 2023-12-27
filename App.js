import { StyleSheet, Text, View } from "react-native";
import { NativeBaseProvider } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreens from "./src/screens/HomeScreens";
import LoginScreen from "./src/screens/LoginScreen";
import ChatScreen from "./src/screens/ChatScreen";
import ProfileUser from "./src/screens/ProfileUser";
import SignupScreen from "./src/screens/SignupScreen";
import Notify from "./src/components/notification/Notify";
const Stack = createStackNavigator();

export default function App() {
  return (
    <NativeBaseProvider>
      {/* <HomeScreens/> */}
      <LoginScreen/>
      {/* <ChatScreen/> */}
      {/* <ProfileUser/> */}
    </NativeBaseProvider>
    );
}