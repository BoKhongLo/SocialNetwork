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
  InteractDto,
} from "../../../util/dto";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const Edit = ({receivedData}) => {
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
            <EditNickname room={receivedData}/>
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
  useEffect(() => {
    let tmpDataMember = [];
    console.log(room)
    for (let i = 0; i < room.member.length; i++) {
      let tmpMember = {
        id: room.member[i],
        placeholder: 'Nickname',
        typeButton: "edit",
        
      }
    }
  }, [])
  const data = [
    { id: 1, placeholder: 'Nickname', typeButton: "edit", onPress: () => console.log('Nickname1') },
    { id: 2, placeholder: 'Nickname', typeButton: "edit", onPress: () => console.log('Nickname2') },
    { id: 3, placeholder: 'Nickname', typeButton: "edit", onPress: () => console.log('Nickname2') },
    { id: 4, placeholder: 'Nickname', typeButton: "edit", onPress: () => console.log('Nickname2') },
    // Add more items as needed
  ];

  const renderItem = ({ item }) => (
    <View style={settingChat.nicknameItem}>
      <Image style={settingChat.avtCustom} />
      <View style={settingChat.textInputContainer}>
        <TextInput
          style={{
            marginLeft: 10,
            padding: 10,
            fontSize: 18,
          }}
          placeholder={item.placeholder}
          editable={false}
          onChangeText={(text) => {
            // Handle text input changes for the nickname
            console.log('Nickname:', text);
          }}
          onBlur={() => {
            // Handle onBlur event for the nickname
            console.log('Nickname blurred');
          }}
        />
      </View>
      <TouchableOpacity 
      style={{ marginTop: 15}}
      onPress={item.onPress}
      >
        <Text>
          <FontAwesome name={item.typeButton} size={30} color="#333" />
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
        <View style={settingChat.nicknameContainer}>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
        </View>
  );
};
export default Edit;