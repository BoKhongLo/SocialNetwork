import { View, Text,Image, Touchable, TouchableOpacity, onPress,Pressable } from 'react-native'
import React from 'react'
import styles from '../../styles/styles'

const BottomTabs = () => {
  return (
    <View style = {styles.BottomTabContainer}>
        <TouchableOpacity >
            <Image 
            style = {styles.BottomTabIcon}
            source = {require('../../../assets/dummyicon/X.png')}
            onPress ={()=> console.log('da nhan nut')}/>
        </TouchableOpacity>
        <TouchableOpacity >        
            <Image 
            style = {styles.BottomTabIcon}
            source = {require('../../../assets/dummyicon/X.png')}
            onPress ={()=> console.log('da nhan nut 1')}/>
        </TouchableOpacity>
        <TouchableOpacity >        
            <Image 
            style = {styles.BottomTabIcon}
            source = {require('../../../assets/dummyicon/X.png')}
            onPress ={()=> console.log('da nhan nut 2')}/>
        </TouchableOpacity>
        <TouchableOpacity >        
            <Image 
            style = {styles.BottomTabIcon}
            source = {require('../../../assets/dummyicon/X.png')}
            onPress ={()=> console.log('da nhan nut 3')}/>
        </TouchableOpacity>
        <TouchableOpacity >        
            <Image 
            style = {styles.BottomTabIcon}
            source = {require('../../../assets/dummyicon/X.png')}
            onPress ={()=> console.log('da nhan nut 4')}/>
        </TouchableOpacity>
    </View>
  )
}

export default BottomTabs