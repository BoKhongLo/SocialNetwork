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
import React from "react";
import styles from "../../styles/styles";

const BottomTabs = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.BottomTabContainer}>
      <TouchableOpacity  onPress={() => navigation.navigate('main')}>
        <Image
          style={styles.BottomTabIcon}
          source={require("../../../assets/dummyicon/icons8-home-25.png")}
          onPress={() => console.log("da nhan nut")}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image
          style={styles.BottomTabIcon}
          source={require("../../../assets/dummyicon/icons8-search-25.png")}
          onPress={() => console.log("da nhan nut 1")}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image
          style={styles.BottomTabIcon}
          source={require("../../../assets/dummyicon/icons8-add-new-25.png")}
          onPress={() => console.log("da nhan nut 2")}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image
          style={styles.BottomTabIcon}
          source={require("../../../assets/dummyicon/icons8-start-25.png")}
          onPress={() => console.log("da nhan nut 3")}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Image
          style={styles.BottomTabIcon}
          source={require("../../../assets/dummyicon/icons8-user-25.png")}
          onPress={() => console.log("da nhan nut 4")}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BottomTabs;
