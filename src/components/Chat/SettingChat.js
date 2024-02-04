import { View, Text } from "react-native";
import React, {useEffect, useState} from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "./SettingChat/Header";
import Edit from "./SettingChat/Edit";
import Infor from "./Infor";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  getAllIdUserLocal,
  getDataUserLocal,
  updateAccessTokenAsync,
  getUserDataLiteAsync,
  getSocketIO,
  getRoomchatAsync,
} from "../../util";
import LoadingAnimation from "../Loading/loadingAnimation";

const SettingChat = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const [receivedData, setReceivedData] = React.useState(route.params?.data);
  const [dataRoom, setDataRoom] = React.useState([]);
  const [dataUser, setDataUser] = React.useState({});
  const [dataUserCurrent, setDataUserCurrent] = React.useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (receivedData == null) {
        navigation.navigate('main');
      }
      setIsLoading(true);
      const keys = await getAllIdUserLocal();
      const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
      const dataUpdate = await updateAccessTokenAsync(
        dataUserLocal.id,
        dataUserLocal.refreshToken
      );

      let dataRoomchat = await getRoomchatAsync(receivedData.id, dataUpdate.accessToken)
      dataRoomchat.title = receivedData.title;
      dataRoomchat.imgDisplay = receivedData.imgDisplay;
      setDataRoom(dataRoomchat)
      let tmpDataMember = {}
      let tmpDataUserCurrent = await getUserDataLiteAsync(dataUserLocal.id, dataUpdate.accessToken);
      tmpDataMember[tmpDataUserCurrent.id] = tmpDataUserCurrent;
      setDataUserCurrent(tmpDataUserCurrent);
      for (let i = 0; i < receivedData.member.length; i++) {
        if (receivedData.member[i] in tmpDataMember) continue;
        let tmpMember = await getUserDataLiteAsync(receivedData.member[i], dataUpdate.accessToken);
        tmpDataMember[tmpMember.id] = tmpMember
      }
      setDataUser(tmpDataMember)
      setIsLoading(false);
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
      <Edit receivedData={dataRoom} users={dataUser} userCurrent={dataUserCurrent}/>
      <LoadingAnimation isVisible={isLoading} />
    </View>
  );
};

export default SettingChat;