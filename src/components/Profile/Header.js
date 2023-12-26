import { View, Text, Image } from 'react-native'
import React from 'react'
import profileStyle from '../../styles/profileStyles'

const Header = ({user}) => {
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 0.08,}}>
      <View>
      <Text style={profileStyle.userNameStyles}>{user.username}</Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <Image source={require('../../../assets/dummyicon/icons8-add-new-25.png')}/>
      <Image source={require('../../../assets/dummyicon/icons8-add-new-25.png')}/>
      </View>
    </View>
  )
}
export default Header