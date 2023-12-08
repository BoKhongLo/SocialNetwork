import { View, Text, Image } from 'react-native'
import React from 'react'
import styles from '../styles/styles'
import LoginForm from '../components/componentsLogin/LoginForm'

const LoginScreen = () => {
  return (
    <View style = {styles.LoginContainer}>
        <View style = {styles.logoContainer}>
            <Image
                style = {styles.imgLogo}
                source = {require('../../assets/img/logoLogin.png')}
            />
        </View>
        <View>
            <LoginForm/>
        </View>


    </View>
  )
}

export default LoginScreen