import { View, Text } from "react-native";
import React, {useEffect} from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "./SettingChat/Header";
import Edit from "./SettingChat/Edit";
import Infor from "./Infor";
import { useNavigation, useRoute } from "@react-navigation/native";

const SettingChat = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const receivedData = route.params?.data;

  useEffect(() => {
    const fetchData = async () => {
      if (receivedData == null) {
        navigation.navigate('main');
      }
      console.log(receivedData);
    };
    fetchData();
  }, []);

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
        flex:1,
        backgroundColor:'white'

      }}
    >
      <Header receivedData={receivedData}/>
      <Infor receivedData={receivedData}/>
      <Edit receivedData={receivedData}/>
    </View>
  );
};

export default SettingChat;