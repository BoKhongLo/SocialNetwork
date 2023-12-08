import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from '../../styles/styles'
const Header = () => {
  return (
    <View style = {styles.headerContainer}>

      <TouchableOpacity>
        <Image
          style={styles.logo}
          source = { require('../../../assets/img/logoLogin.png')}
        />
      </TouchableOpacity>

        <View style = {styles.iconContainer}>
          <TouchableOpacity>
            <Text styles = {styles.icon}> icon </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style = {styles.unreadBadge}>
              <Text style = {styles.unreadBadgeText}> </Text>
            </View>
            <Text styles = {styles.icon}> icon </Text>
          </TouchableOpacity>
          
        </View>
    </View>
  )
}

export default Header