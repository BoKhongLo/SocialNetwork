import {
  View,
  Text,
  Image,
  Touchable,
  TouchableOpacity,
  onPress,
  Pressable,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import React, { useState } from "react";
import styles from "../../styles/styles";
const BottomTabs = ({receivedData}) => {

  const navigation = useNavigation();
  return (
    <View style={styles.BottomTabContainer}>
      <TouchableOpacity  onPress={() => navigation.navigate('main')}>
        <Image
          style={styles.BottomTabIcon}
          source={require("../../../assets/dummyicon/home_6_line.png")}
          onPress={() => console.log("da nhan nut home")}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image
          style={styles.BottomTabIcon}
          source={require("../../../assets/dummyicon/search_line.png")}
          onPress={() => console.log("da nhan nut search")}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image
          style={styles.BottomTabIcon}
          source={require("../../../assets/dummyicon/new.png")}
          onPress={() => console.log("da nhan nut create post")}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile', {data: receivedData})}>
        <Image
          style={styles.BottomTabIcon}
          source={require("../../../assets/dummyicon/user.png")}
          onPress={() => console.log("da nhan nut user site")}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BottomTabs;