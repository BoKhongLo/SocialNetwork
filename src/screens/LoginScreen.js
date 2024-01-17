import { View, Text, Image } from 'react-native'
import React from 'react'
import styles from '../styles/styles'
import LoginForm from '../components/Login/LoginForm'
import ToastManager from 'toastify-react-native'

const LoginScreen = () => {
  return (
    <View style = {styles.LoginContainer}>
          <ToastManager  />
        <View style = {styles.logoContainer}>
            <Text style={{fontSize:30, fontWeight: '500', marginBottom: 10}}>Log in</Text>
            <Text style={{fontSize:30, fontWeight: '400', marginBottom:100, color:'grey'}}>Hi! Welcome</Text>
        </View>
        <View>
            <LoginForm/>
        </View>
    </View>
  )
}

export default LoginScreen