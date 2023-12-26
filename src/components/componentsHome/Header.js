import React from 'react';
import { View,Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../../styles/styles';

const Header = () => {
  const navigation = useNavigation();

  return (
    <View>
      <View style={styles.headerContainer}>
        <TouchableOpacity>
          <Image
            style={styles.logo}
            source={require('../../../assets/img/Instagram_logo.png')}
          />
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <TouchableOpacity
          onPress={() => navigation.navigate('noti')}
          style={{ marginRight: 20 }}>
            <Image
              style={styles.icon}
              source={require('../../../assets/dummyicon/icons8-heart-25.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: 'row'}}
            onPress={() => navigation.navigate('chat')}
          >
            <Image
              style={styles.icon}
              source={require('../../../assets/dummyicon/icons8-chat-message-25.png')}
            />
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}></Text>
            </View>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
};

export default Header;