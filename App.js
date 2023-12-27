import { StyleSheet, Text, View } from "react-native";
import { NativeBaseProvider } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import HomeScreens from "./src/screens/HomeScreens";
import LoginScreen from "./src/screens/LoginScreen";
import ChatScreen from "./src/screens/ChatScreen";
import ProfileUser from "./src/screens/ProfileUser";
import SignupScreen from "./src/screens/SignupScreen";
import Notify from "./src/components/notification/Notify";
import { getAllIdUserLocal, deleteDataUserLocal } from './src/util'
const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Function to check user login status
    const checkLoginStatus = async () => {
      try {
        // const keys = await getAllIdUserLocal();
        const keys = []
        console.log("user", keys)
        for (const key in keys) {
          await deleteDataUserLocal(key)
        }
        setIsLoggedIn(keys.length !== 0);


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
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "main" : "Login"}>
        {isLoggedIn ? (
          <>
            <Stack.Screen key="main" options={{ headerShown: false }} name="main" component={HomeScreens} />
            <Stack.Screen key="Profile" options={{ headerShown: false }} name="Profile" component={ProfileUser} />
            <Stack.Screen key="chat" options={{ headerShown: false }} name="chat" component={ChatScreen} />
            <Stack.Screen key="noti" options={{ headerShown: false }} name="noti" component={Notify} />
          </>
        ) : (
          <>
            <Stack.Screen key="Login" options={{ headerShown: false }} name="Login" component={LoginScreen} />
            <Stack.Screen key="Signup" options={{ headerShown: false }} name="Signup" component={SignupScreen} />
          </>
        )}
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