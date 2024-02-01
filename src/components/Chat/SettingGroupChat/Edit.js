import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Image,
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
  validateNicknameMemberRoomchatAsync,

} from "../../../util";
import {
  InteractDto, ValidateMemberRoomDto,
} from "../../../util/dto";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Item from './../cpnGroupChat/Item';

const Edit = ({ receivedData, users, userCurrent }) => {
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isViewMembersModalVisible, setViewMembersModalVisible] = useState(false);
  const navigation = useNavigation();

  const [isEditAvatarModalVisible, setEditAvatarModalVisible] = useState(false);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isNicknameModalVisible, setNicknameModalVisible] = useState(false);
  const [dataReturn, setDataReturn] = useState(receivedData);


  useEffect(() => {
    setDataReturn(receivedData);
    console.log(receivedData.isBlock)
  }, [receivedData])


  const updateDataReturn = (data) => {
    setDataReturn(data);
  }
  const showNicknameModal = () => {
    setNicknameModalVisible(true);
  };

  const hideNicknameModal = () => {
    setNicknameModalVisible(false);
  }

  const showEditModal = () => {
    setEditModalVisible(true);
  };

  const hideEditModal = () => {
    setEditModalVisible(false);
  };

  const showViewMembersModal = () => {
    setViewMembersModalVisible(true);
  };

  const hideViewMembersModal = () => {
    setViewMembersModalVisible(false);
  };

  return (
    <View style={settingChat.editContainer}>
      <View>
        <Text style={settingChat.title}>General</Text>
        <View>
          <TouchableOpacity
            style={settingChat.editItemContainer}
            onPress={showEditModal}
          >
            <Text style={settingChat.editItem}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={settingChat.editItemContainer}
            onPress={showViewMembersModal}
          >
            <Text style={settingChat.editItem}>View Members</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={settingChat.editItemContainer}
            onPress={showEditModal}
          >
            <Text style={settingChat.editItem}>Add members</Text>
          </TouchableOpacity>

          <Modal visible={isEditModalVisible} animationType="slide">
            {/* Edit Modal Content */}
            <TouchableOpacity onPress={hideEditModal}>
              <Image
                style={settingChat.button}
                source={require("../../../../assets/dummyicon/left_line_64.png")}
              />
            </TouchableOpacity>
          </Modal>

          <Modal visible={isViewMembersModalVisible} animationType="slide">
            {/* View Members Modal Content */}
            <TouchableOpacity onPress={hideViewMembersModal}>
              <Image
                style={settingChat.button}
                source={require("../../../../assets/dummyicon/left_line_64.png")}
              />
            </TouchableOpacity>
            <View>
              <View>
                <View>
                  <Text>Admins & moderators</Text>

                  <Item />
                </View>
              </View>
            </View>
            {/* Add the rest of your modal content here */}
          </Modal>
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
              <EditNickname room={dataReturn} users={users} updateRoom={updateDataReturn} />
            </View>
          </Modal>
        </View>
        <View>
          <Text style={settingChat.title}>Privacy</Text>
          <TouchableOpacity style={settingChat.editItemContainer}>
            <Text style={settingChat.editItem}>Leave Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={settingChat.editItemContainer}>
            <Text style={settingChat.editItem}>Delete Group</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const EditNickname = ({ users, room, updateRoom }) => {

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
      if ('memberNickname' in room) {
        if (room.member[i] in room.memberNickname) {
          tmpMember.nickName = room.memberNickname[room.member[i]];
        }
      }
      tmpDataMember.push(tmpMember);
    }
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
      const keys = await getAllIdUserLocal();
      const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
      const dto = new ValidateMemberRoomDto(data.id, room.id, data.nickName, []);
      let dataRe = await validateNicknameMemberRoomchatAsync(dto, dataLocal.accessToken);
      if ("errors" in dataRe) {
        let dataUpdate = await updateAccessTokenAsync(dataLocal.id, dataLocal.refreshToken);
        dataRe = await validateNicknameMemberRoomchatAsync(dto, dataLocal.accessToken);
      }
      if ("errors" in dataRe) return
      let newData = { ...room }
      newData.memberNickname[data.id] = data.nickName
      updateRoom(newData)
      setDataMember((preData) => {
        let indexMember = preData.findIndex(item => item.id === data.id);
        if (indexMember == -1) return preData;
        preData[indexMember].typeButton = "edit";
        return [...preData];
      })
    }

    setRefreshing(false);
  }

  const renderItem = ({ item }) => {
    return (
      <View style={settingChat.nicknameItem}>
        {users[item.id] && users[item.id].detail.avatarUrl ? (
          <Image style={settingChat.avtCustom} source={{ uri: users[item.id].detail.avatarUrl }} />
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
          {users[item.id] && (
            <Text
              style={{
                fontSize: 20,
                padding: 5,
                color: "black",
              }}>
              {users[item.id].detail.name}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={{ marginTop: 15 }}
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



const AddMember = ({ room, userCurrent, }) => {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupMember, setGroupMember] = useState([]);
  const [dataFriends, setDataFriends] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const keys = await getAllIdUserLocal();
      const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
      const dataUserLocal = { ...dataLocal }
      const tmpDataFriends = [];
      for (let i = 0; i < userCurrent.friends.length; i++) {
        if (room.member.include(userCurrent.friends[i].id)) continue;
        let dataReturn = await getUserDataLiteAsync(
          userCurrent.friends[i],
          dataUserLocal.accessToken
        );
  
        if ("errors" in dataReturn) {
          const dataUpdate = await updateAccessTokenAsync(
            dataUserLocal.id,
            dataUserLocal.refreshToken
          );
          dataUserLocal.accessToken = dataUpdate.accessToken;
          dataReturn = await getUserDataLiteAsync(
            userCurrent.friends[i],
            dataUpdate.accessToken
          );
        }
        tmpDataFriends.push(dataReturn);
      }
      setDataFriends(tmpDataFriends);
    }
    fetchData()
  }, [userCurrent])

  const updateMember = (userId) => {
    setGroupMember(preGroup => [...preGroup, userId]);
  }

  const removeMember = (userId) => {
    setGroupMember(preGroup => preGroup.filter(member => member !== userId));
  }

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
    setRefreshing(false);
  }

  const renderItem = ({ item }) => {
    return (
      <Item user={item} onAdd={updateMember} onRemove={removeMember} />
    )
  };

  return (
    <View style={settingChat.nicknameContainer}>
      <FlatList
        data={dataFriends}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshing={refreshing}
      />
    </View>
  );
};
export default Edit;