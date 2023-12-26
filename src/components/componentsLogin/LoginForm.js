import { View, Text, TextInput, Button, secureTextEntry, Pressable, onPress, TouchableOpacity } from 'react-native'
import React,  { useState } from 'react'
import styles from '../../styles/styles'
import { LoginDto } from '../../util/dto'
import { LoginAsync, getUserDataAsync } from '../../util'

const LoginForm = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // Add your logic here
  };

  const handleLogin = async () => {
    console.log('Login clicked');
    const dto = new LoginDto(email, password);
    const dataLogin = await LoginAsync(dto);
    console.log(dataLogin)

    const dataUser = await getUserDataAsync(dataLogin.id, dataLogin.accessToken)
    console.log(dataUser)


  };

  const handleSignUp = () => {
    console.log('Sign up clicked');
    // Add your sign-up logic here
  };

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
            value={email}
            onChangeText={(text) => setEmail(text)}
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
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
      </View>

        <TouchableOpacity style ={{alignItems:'flex-end', marginBottom:30}} onPress ={ () => handleForgotPassword()}>
            <Text style = {{color: '#6BB0F5'}}> Forgot password </Text>
        </TouchableOpacity>
      

      <TouchableOpacity titleSize ={20} style ={styles.buttonLogin} onPress ={ () => handleLogin()}>
        <Text style = {styles.buttonLoginText}> Log in</Text>
      </TouchableOpacity>

      <View style ={ styles.signupContainer}>
        <Text> Don't have an account ?  
          <TouchableOpacity onPress ={() => handleSignUp()}>
            <Text style ={{color : '#6BB0F5'}}> Sign up !!</Text>
          </TouchableOpacity>
        </Text>
      </View>

    </View>
  )
}

export default LoginForm