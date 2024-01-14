import { View, Text, Image } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Divider } from "react-native-elements";
import notistyles from "../../styles/notiStyles";
import { Touchable } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from '@react-navigation/native';
import styles from "../../styles/styles";


const Notification = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        flex: 1,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: 'flex-start', alignItems:'center' }}>
        <TouchableOpacity onPress={() => navigation.navigate('main')}>
          <Image
          style={styles.iconforAll}
            source={require("../../../assets/dummyicon/left_line_64.png")}
          />
        </TouchableOpacity>
        <Text style={notistyles.headerName}> Notify </Text>
      </View>
      <Divider width={1} orientation="vertical" />
    </View>
  );
};

const addFriendnoti = () => {
  return;
}

const notiPost = () => {
  return;
}

export default Notification;