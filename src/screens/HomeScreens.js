import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import styles from '../styles/styles'

import Header from '../components/componentsHome/Header'
import Stroies from '../components/componentsHome/Stories'
import Bottomtabs from '../components/componentsHome/BottomTabs'
import Post from '../components/componentsHome/Post'

import LoginScreen from './LoginScreen'

const HomeScreens = () => {
  return (
    <SafeAreaView style = {styles.container}>
      <ScrollView style = {{flex:1}}>
        <Header/> 
        <Stroies/>
        <Post/>
      </ScrollView>
      {/* <Bottomtabs/> */}
    </SafeAreaView>
  )
}


export default HomeScreens