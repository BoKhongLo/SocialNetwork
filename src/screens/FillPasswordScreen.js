import { View, Text } from "react-native";
import React, {useEffect} from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Form from '../components/FillPassword/Form';
import Header from '../components/FillPassword/Header';
import { useNavigation, useRoute } from "@react-navigation/native";

const NewPassScreen = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation();
  const receivedData = route.params?.data;
  useEffect(() => {
    const fetchData = async () => {
      if (receivedData == null) {
        navigation.navigate('Login');
      }
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
      }}
    >
      <Header receivedData={receivedData} />
      <Form receivedData={receivedData} />
    </View>
  );
};
export default NewPassScreen