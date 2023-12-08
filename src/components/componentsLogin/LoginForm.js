import { View, Text, TextInput, Button, secureTextEntry, Pressable, onPress, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from '../../styles/styles'

const LoginForm = () => {
  return (
    <View style = {styles.wrapper}>

      <View style = {styles.inputField}>
        <TextInput 
            placeholderTextColor='#444'
            placeholder='Phone number, Username or Email'
            autoCapitalize='none'
            keyboardType='email-address'
            textContentType='emailAddress'
            autoFocus = {true}
          />
      </View>

      <View style = {styles.inputField}>
        <TextInput
            placeholderTextColor='#444'
            placeholder='Password'
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={true}
            textContentType='passWord'
          />
      </View>

        <TouchableOpacity style ={{alignItems:'flex-end', marginBottom:30}} onPress ={()=> console.log('da nhan')} >
            <Text style = {{color: '#6BB0F5'}}> Forgot password </Text>
        </TouchableOpacity>
      

      <TouchableOpacity titleSize ={20} style ={styles.buttonLogin} onPress ={()=> console.log('da nhan')}>
        <Text style = {styles.buttonLoginText}> Log in</Text>
      </TouchableOpacity>

      <View style ={ styles.signupContainer}>
        <Text> Don't have an account ?  
          <TouchableOpacity>
            <Text style ={{color : '#6BB0F5'}}> Sign up !!</Text>
          </TouchableOpacity>
        </Text>
      </View>

    </View>
  )
}

export default LoginForm