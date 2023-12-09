import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from '../../styles/styles'
const Header = () => {
  return (
    <View style = {styles.headerContainer}>

      <TouchableOpacity>
        <Image
          style={styles.logo}
          source = { require('../../../assets/img/Instagram_logo.png')}
        />
      </TouchableOpacity>

        <View style = {styles.iconContainer}>
          <TouchableOpacity style={{marginRight: 20}}>
            <Image styles = {styles.icon} source={require('../../../assets/dummyicon/X.png')}/> 
          </TouchableOpacity>

          <TouchableOpacity style={{flexDirection: 'row'}}> 
            <Image styles = {styles.icon} source={require('../../../assets/dummyicon/X.png')}/> 
            <View style = {styles.unreadBadge}></View>
          </TouchableOpacity>
        </View>
    </View>
  )
}

export default Header