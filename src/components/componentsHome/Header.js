import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from '../../styles/styles'
import { StatusBar } from 'native-base'
const Header = () => {
  return (
    <View>
      <View style = {styles.headerContainer}>
        <TouchableOpacity>
          <Image
            style={styles.logo}
            source = { require('../../../assets/img/Instagram_logo.png')}
          />
        </TouchableOpacity>
          <View style = {styles.iconContainer}>
            <TouchableOpacity style={{marginRight: 20}}>
              <Image styles = {styles.icon} source={require('../../../assets/dummyicon/icons8-heart-25.png')}/>
            </TouchableOpacity>

            <TouchableOpacity style={{flexDirection: 'row'}}> 
              <Image styles = {styles.icon} source={require('../../../assets/dummyicon/icons8-chat-message-25.png')}/> 
              <View style = {styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}></Text>
              </View>
            </TouchableOpacity>
          </View>
      </View>
    </View>
  )
}

export default Header