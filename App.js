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
import EditField from "./src/components/Profile/EditField";
import LoadStories from "./src/components/componentsHome/LoadStories";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen options={{headerShown: false}} name="main" component={HomeScreens} />
        <Stack.Screen options={{headerShown: false}}  name="Profile" component={ProfileUser} />
        <Stack.Screen options={{headerShown: false}}  name="chat" component={ChatScreen} />
        <Stack.Screen options={{headerShown: false}}  name="noti" component={Notify} />
        <Stack.Screen options={{headerShown: false}}  name="editfield" component={EditField} />
        <Stack.Screen options={{headerShown: false}}  name="loadStory" component={LoadStories} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}