import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Image,
  Pressable,
  FlatList
} from "react-native";
import settingChat from "../../../styles/ChatStyles/settingStyle";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  getAllIdUserLocal,
  getDataUserLocal,
  updateAccessTokenAsync,
  getUserDataAsync,
  getSocketIO,
  getUserDataLiteAsync,
  blockRoomchatAsync,
  unblockRoomchatAsync,

} from "../../../util";
import {
  InteractDto, ValidateMemberRoomDto,
} from "../../../util/dto";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Item from './../cpnGroupChat/Item';

const Edit = ({receivedData, users}) => {
  const navigation = useNavigation();
  
  const [isEditAvatarModalVisible, setEditAvatarModalVisible] = useState(false);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isNicknameModalVisible, setNicknameModalVisible] = useState(false);

  const showEditAvatarModal = () => {
    setEditAvatarModalVisible(true);
  };

  const hideEditAvatarModal = () => {
    setEditAvatarModalVisible(false);
  };

  const showProfileModal = () => {
    setProfileModalVisible(true);
  };

  const hideProfileModal = () => {
    setProfileModalVisible(false);
  };

  const showNicknameModal = () => {
    setNicknameModalVisible(true);
  };

  const hideNicknameModal = () => {
    setNicknameModalVisible(false);
  };

  const handlePressedProfile = async () => {
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    const returnData = { ...dataUserLocal };
    if (returnData.id == receivedData.member[0]) {
      returnData.id = receivedData.member[1];
    }
    else {
      returnData.id = receivedData.member[0];
    }

    navigation.replace("Profile", { data: returnData });
  }

  return (
    <View style={settingChat.editContainer}>
      <View>
        <Text style={settingChat.title}>General</Text>
        <View>
          <TouchableOpacity
            style={settingChat.editItemContainer}
            onPress={async () => await handlePressedProfile()}
          >
            <Text style={settingChat.editItem}>View Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={settingChat.editItemContainer}
            onPress={showNicknameModal}
          >
            <Text style={settingChat.editItem}>Nickname</Text>
          </TouchableOpacity>
          <Modal visible={isNicknameModalVisible} animationType="slide">
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => hideNicknameModal(false)}>
              <Image
                style={settingChat.button}
                source={require('../../../../assets/dummyicon/left_line_64.png')}
              />
            </TouchableOpacity>
            <EditNickname room={receivedData} users={users}/>
          </View>
          </Modal>
        </View>
        <View>
          <Text style={settingChat.title}>Privacy</Text>
          <TouchableOpacity style={settingChat.editItemContainer}>
            <Text style={settingChat.editItem}>Block User</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={settingChat.editItemContainer}>
            <Text style={settingChat.editItem}>Hide</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
};
const EditNickname = ({users, room}) => {

  const [dataMember, setDataMember] = useState([{}]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let tmpDataMember = [];
    console.log(room)
    for (let i = 0; i < room.member.length; i++) {
      let tmpMember = {
        id: room.member[i],
        nickName: "",
        typeButton: "edit"
      }
      // if (room.member[i] in room.memberNickname) {
      //   tmpMember.nickName = room.memberNickname[room.member[i]];
      // }
      tmpDataMember.push(tmpMember);
    }
    console.log(tmpDataMember)
    setDataMember(tmpDataMember);
  }, [])

  const updateValueNickName = (text, item) => {
    setRefreshing(true);
    setDataMember((preData) => {
      let indexMember = preData.findIndex(items => items.id === item.id);
      if (indexMember == -1) return preData;
      preData.nickName = text;
      let dataRe = [...preData]
      dataRe[indexMember].nickName = text;
      return dataRe;
    })
    setRefreshing(false);
  }

  const handleEditNickname = async (data) => {
    setRefreshing(true);
    if (data.typeButton === "edit") { 
      setDataMember((preData) => {
        let indexMember = preData.findIndex(item => item.id === data.id);
        if (indexMember == -1) return preData;
        preData[indexMember].typeButton = "check";
        return [...preData];
      })
    }
    else if (data.typeButton === "check") {
      setDataMember((preData) => {
        let indexMember = preData.findIndex(item => item.id === data.id);
        if (indexMember == -1) return preData;
        preData[indexMember].typeButton = "edit";
        return [...preData];
      })
      const dto = new ValidateMemberRoomDto(data.id, room.id, data.nickName, [])
      console.log(dto)
    }

    setRefreshing(false);
  }

  const renderItem = ({ item }) => {
    return (
    <View style={settingChat.nicknameItem}>
      {users[item.id] && users[item.id].detail.avatarUrl ? (
      <Image style={settingChat.avtCustom} source={{uri: users[item.id].detail.avatarUrl}} />
      ) : (
      <Image style={settingChat.avtCustom} />
      )}
      <View style={settingChat.textInputContainer}>
        <TextInput
          style={{
            marginLeft: 10,
            padding: 10,
            fontSize: 18,
            color: "black",
            borderBottomWidth: 1,
          }}
          editable={item.typeButton === "edit" ? false : true}
          value={item.nickName}
          placeholder="Nickname"
          onChangeText={(text) => updateValueNickName(text, item)}
        />
        {users[item.id] &&  (
        <Text
        style={{
          fontSize: 18,
          padding:5,
          color: "black",
        }}>
          {users[item.id].detail.name}
        </Text>
        )}
      </View>
      <TouchableOpacity 
      style={{ marginTop: 15}}
      onPress={async () => await handleEditNickname(item)}
      >
        <Text>
          <FontAwesome name={item.typeButton} size={30} color="#333" />
        </Text>
      </TouchableOpacity>
    </View>
    )
  };

  return (
      <View style={settingChat.nicknameContainer}>
        <FlatList
          data={dataMember}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshing={refreshing}
        />
      </View>
  );
};
export default Edit;