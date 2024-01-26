import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/styles";

const Header = ({ receivedData }) => {
  const navigation = useNavigation();

  return (
    <View>
      <View style={[styles.headerContainer]}>
        <TouchableOpacity>
          <Image
            style={styles.logo}
            source={require('../../../assets/img/Instagram_logo.png')}
          />
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <TouchableOpacity
          onPress={() => navigation.replace('noti', {data: receivedData})}
          style={{ marginRight: 20 }}>
            <Image
              style={styles.icon}
              source={require('../../../assets/dummyicon/heart.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: 'row'}}
            onPress={() => navigation.replace('chat', {data: receivedData})}
          >
            <Image
              style={styles.icon}
              source={require('../../../assets/dummyicon/chat.png')}
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
