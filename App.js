import { StyleSheet, Text, View } from 'react-native';
import { NativeBaseProvider } from 'native-base';


import HomeScreens from './src/screens/HomeScreens';
import LoginScreen from './src/screens/LoginScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProfileUser from './src/screens/ProfileUser';


export default function App() {
  return (
    <NativeBaseProvider>
      {/* <HomeScreens/> */}
      {/* <LoginScreen/> */}
      {/* <ChatScreen/> */}
      <ProfileUser/>
    </NativeBaseProvider>
    );
}