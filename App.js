import {  GestureHandlerRootView, gestureHandlerRootHOC} from 'react-native-gesture-handler'
import 'react-native-gesture-handler';
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import HomeScreens from "./src/screens/HomeScreens";
import LoginScreen from "./src/screens/LoginScreen";
import ChatScreen from "./src/screens/ChatScreen";
import ProfileUser from "./src/screens/ProfileUser";
import SignupScreen from "./src/screens/SignupScreen";
import NotiScreen from "./src/screens/NotiScreen";
import EditField from "./src/components/Profile/EditField";
import LoadStories from "./src/components/Home/LoadStories";
import ChatWindows from "./src/components/Chat/ChatWindows";
import { getAllIdUserLocal, deleteDataUserLocal, updateAccessTokenAsync, getDataUserLocal } from './src/util'
import Setting from "./src/components/Profile/Setting";
import ChangePassword from "./src/components/Profile/ChangePassword";
import NewPost from "./src/screens/NewPost";
import NewStory from "./src/screens/NewStory";
import SearchScreen from "./src/screens/SearchScreen";
import SettingChat from "./src/components/Chat/SettingChat";
import ForgotPassScreen from "./src/screens/FillEmailScreen";
import VerifyScreen from "./src/screens/VerifyScreen";
import NewPassScreen from "./src/screens/FillPasswordScreen";
import ListFriend from "./src/screens/ListFriend";
import ListPost from "./src/screens/ListPost";
import SettingGroupChat from "./src/components/Chat/SettingGroup";

import BuyPremium from "./src/screens/BuyPremium";
import GenderAndPhone from "./src/components/Profile/GenderAndPhone";
import ContactUs from "./src/components/Profile/ContactUs";

const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  
  useEffect(() => {
    // Function to check user login status
    const checkLoginStatus = async () => {
      try {
        const keys = await getAllIdUserLocal();
        if (keys.length ==  0) {
          setIsLoggedIn(false);
          return;
        }
        const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
        const dataAsync = await updateAccessTokenAsync(dataLocal.id, dataLocal.refreshToken)
        
        if ("errors" in dataAsync) {
          await deleteDataUserLocal(keys[keys.length - 1]);
          setIsLoggedIn(false);
          return
        }
        
        setIsLoggedIn(true);


      } catch (error) {
        console.error("Error checking user login status:", error);
      } finally {
        setLoading(false); // Set loading to false after checking is done
      }
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <Text>Loading...</Text>
      </GestureHandlerRootView>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "main" : "Login"}>
            <Stack.Screen key="main" options={{ headerShown: false }} name="main" component={gestureHandlerRootHOC(HomeScreens)} />
            <Stack.Screen key="chat" options={{ headerShown: false }} name="chat" component={gestureHandlerRootHOC(ChatScreen)} />
            <Stack.Screen key="noti" options={{ headerShown: false }} name="noti" component={gestureHandlerRootHOC(NotiScreen)} />
            <Stack.Screen key="Login" options={{ headerShown: false }} name="Login" component={gestureHandlerRootHOC(LoginScreen)} />
            <Stack.Screen key="Signup" options={{ headerShown: false }} name="Signup" component={gestureHandlerRootHOC(SignupScreen)} />
            <Stack.Screen key="Profile" options={{ headerShown: false }} name="Profile" component={gestureHandlerRootHOC(ProfileUser)} />
            <Stack.Screen key="editField" options={{ headerShown: false }} name="editField" component={gestureHandlerRootHOC(EditField)} />
            <Stack.Screen key="loadStory" options={{headerShown: false}}  name="loadStory" component={gestureHandlerRootHOC(LoadStories)} />
            <Stack.Screen key="chatwindow" options={{headerShown: false}}  name="chatwindow" component={gestureHandlerRootHOC(ChatWindows)} />
            <Stack.Screen key="setting" options={{headerShown: false}}  name="setting" component={gestureHandlerRootHOC(Setting)} />
            <Stack.Screen key="changepassword" options={{headerShown: false}}  name="changepassword" component={gestureHandlerRootHOC(ChangePassword)} />
            <Stack.Screen key="newpost" options={{headerShown: false}}  name="newpost" component={gestureHandlerRootHOC(NewPost)} />
            <Stack.Screen key="newstory" options={{headerShown: false}}  name="newstory" component={gestureHandlerRootHOC(NewStory)} />
            <Stack.Screen key="search" options={{headerShown: false}}  name="search" component={gestureHandlerRootHOC(SearchScreen)} />
            <Stack.Screen key="settingChat" options={{headerShown: false}}  name="settingChat" component={gestureHandlerRootHOC(SettingChat)} />
            <Stack.Screen key="fillEmail" options={{headerShown: false}}  name="fillEmail" component={gestureHandlerRootHOC(ForgotPassScreen)} />
            <Stack.Screen key="verify" options={{headerShown: false}}  name="verify" component={gestureHandlerRootHOC(VerifyScreen)} />
            <Stack.Screen key="fillPass" options={{headerShown: false}}  name="fillPass" component={gestureHandlerRootHOC(NewPassScreen)} />
            <Stack.Screen key="settingGroupChat" options={{headerShown: false}}  name="settingGroupChat" component={gestureHandlerRootHOC(SettingGroupChat)} />
            <Stack.Screen key="listFriend" options={{headerShown: false}}  name="listFriend" component={gestureHandlerRootHOC(ListFriend)} />
            <Stack.Screen key="listPost" options={{headerShown: false}}  name="listPost" component={gestureHandlerRootHOC(ListPost)} />
            <Stack.Screen key="buyPremium" options={{headerShown: false}}  name="buyPremium" component={gestureHandlerRootHOC(BuyPremium)} />
            <Stack.Screen key="genderAndPhone" options={{headerShown: false}}  name="genderAndPhone" component={gestureHandlerRootHOC(GenderAndPhone)} />
            <Stack.Screen key="contactUs" options={{headerShown: false}}  name="contactUs" component={gestureHandlerRootHOC(ContactUs)} />
      </Stack.Navigator>
    </NavigationContainer>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});