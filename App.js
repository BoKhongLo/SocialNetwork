import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NativeBaseProvider } from 'native-base';

import { NavigationContainer } from '@react-navigation/native';
// import {AppStack} from './src/navigations/AppStack'


import HomeScreens from './src/screens/HomeScreens';
import LoginScreen from './src/screens/LoginScreen';

export default function App() {
  return (
    <NativeBaseProvider>
      <HomeScreens/>
      {/* <LoginScreen/> */}
    </NativeBaseProvider>
    );
}