import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Image,
  FlatList,
  Alert,
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
  addMemberRoomchatAsync,
  removeMemberRoomchatAsync,
  removeRoomchatAsync,

} from "../../../util";
import {
  InteractDto, MemberRoomDto, ValidateMemberRoomDto,
} from "../../../util/dto";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Item from './../cpnGroupChat/Item';

const Edit = ({ receivedData, users, userCurrent }) => {
  const navigation = useNavigation();
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isViewMembersModalVisible, setViewMembersModalVisible] = useState(false);
  const [isAddMembersModalVisible, setAddMembersModalVisible] = useState(false);
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

  // View MEMBER logic
  const validateViewMembersModal = (value) => {
    setViewMembersModalVisible(value);
  };


  // Add MEMBER logic
  const validateAddMembersModal = (value) => {
    setAddMembersModalVisible(value);
  };
  const [groupMember, setGroupMember] = useState([]);
  const updateMember = (userId) => {
    setGroupMember(preGroup => [...preGroup, userId]);
  }
  const removeMember = (userId) => {
    setGroupMember(preGroup => preGroup.filter(member => member !== userId));
  }
  const addMemberToRoom = async () => {
    if (!userCurrent) return
    const keys = await getAllIdUserLocal();
    const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
    const dto = new MemberRoomDto(userCurrent.id, dataReturn.id, groupMember);
    let dataRe = await addMemberRoomchatAsync(dto, dataLocal.accessToken);
    if ("errors" in dataRe) {
      let dataUpdate = await updateAccessTokenAsync(dataLocal.id, dataLocal.refreshToken);
      dataRe = await addMemberRoomchatAsync(dto, dataUpdate.accessToken);
    }
    if ("errors" in dataRe) return
    validateAddMembersModal(false)
    setDataReturn((preData) => {
      let newData = {...preData};
      newData.member = [...newData.member, ...groupMember]
      return newData;
    })
    setGroupMember([])
  }

  // Leave room logic
  const leaveRoom = async () => {
    if (!userCurrent) return
    const keys = await getAllIdUserLocal();
    const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
    const dto = new MemberRoomDto(userCurrent.id, dataReturn.id, [userCurrent.id]);
    let dataRe = await removeMemberRoomchatAsync(dto, dataLocal.accessToken);
    if ("errors" in dataRe) {
      let dataUpdate = await updateAccessTokenAsync(dataLocal.id, dataLocal.refreshToken);
      dataRe = await removeMemberRoomchatAsync(dto, dataUpdate.accessToken);
    }
    if ("errors" in dataRe) return
    navigation.navigate("main")
  }



  // delete room logic
  const deleteRoom = async () => {
    if (!userCurrent) return
    const keys = await getAllIdUserLocal();
    const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
    let dataRe = await removeRoomchatAsync(userCurrent.id, dataReturn.id, dataLocal.accessToken);
    if ("errors" in dataRe) {
      let dataUpdate = await updateAccessTokenAsync(dataLocal.id, dataLocal.refreshToken);
      dataRe = await removeRoomchatAsync(userCurrent.id, dataReturn.id, dataUpdate.accessToken);
    }
    console.log(dataRe);
    if ("errors" in dataRe) return
    navigation.navigate("main")
  }

  return (
    <View style={settingChat.editContainer}>
      <View>
        <Text style={settingChat.title}>General</Text>
        <View>
          {/** View Members Button */}
          <TouchableOpacity
            style={settingChat.editItemContainer}
            onPress={() => validateViewMembersModal(true)}
          >
            <Text style={settingChat.editItem}>View Members</Text>
          </TouchableOpacity>


          {/* View Members Modal Content */}
          <Modal visible={isViewMembersModalVisible} animationType="slide">
            <TouchableOpacity onPress={() => validateViewMembersModal(false)}>
              <Image
                style={settingChat.button}
                source={require("../../../../assets/dummyicon/left_line_64.png")}
              />
            </TouchableOpacity>
            <View style={{ margin: 10, flex: 1 }}>
              <View>
                {/** renderAdminGroup */}
                <View>
                  <Text style={{ fontSize: 15, color: "#A9A9A9" }}>
                    Admins & moderators
                  </Text>
                  {/** ITEM LA MAY CAI THANG MEMBER DAY M SUA LAI KIEU GI THI SUA T CHIU!!! */}
                  <Item />
                </View>
                {/** renderMembers */}
                <View>
                  <Text style={{ fontSize: 15, color: "#A9A9A9" }}>
                    Members
                  </Text>
                  {/** ITEM LA MAY CAI THANG MEMBER DAY M SUA LAI KIEU GI THI SUA T CHIU!!! */}
                  <Item />
                </View>
              </View>
            </View>
          </Modal>

          {/** Add members Button */}
          <TouchableOpacity
            style={settingChat.editItemContainer}
            onPress={() => validateAddMembersModal(true)}
          >
            <Text style={settingChat.editItem}>Add members</Text>
          </TouchableOpacity>

          {/** Modal Add Members /////////////////////////////////////////*/}
          <Modal visible={isAddMembersModalVisible} animationType="slide">
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity
                  style={{
                    alignSelf: "flex-start",
                  }}
                  onPress={() => validateAddMembersModal(false)}
                >
                  <Image
                    style={settingChat.button}
                    source={require('../../../../assets/dummyicon/left_line_64.png')}
                  />
                </TouchableOpacity>
                <Text style={settingChat.editItem}>Add Member</Text>
                <TouchableOpacity
                  style={{
                    borderWidth: 2,
                    borderColor: "gray",
                    width: 60,
                    height: 40,
                    alignContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                    alignSelf: "flex-end",
                    marginRight: 5
                  }}
                  onPress={async () => await addMemberToRoom()}
                >
                  <Text style={settingChat.editItem}>Save</Text>
                </TouchableOpacity>
              </View>
              <AddMember 
                room={dataReturn} 
                userCurrent={userCurrent} 
                updateMember={updateMember}
                removeMember={removeMember}
              />
            </View>
          </Modal>

          {/** Modal Nick name */}
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
          <TouchableOpacity 
            style={settingChat.editItemContainer}
            onPress={async () =>  await leaveRoom()}
          >
            <Text style={settingChat.editItem}>Leave Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={settingChat.editItemContainer}
            onPress={async () =>  await deleteRoom()}
          >
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
      if (tmpDataMember.findIndex(item => item.id === room.member[i]) !== -1) continue;
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



const AddMember = ({ room, userCurrent, updateMember, removeMember }) => {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const [dataFriends, setDataFriends] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const keys = await getAllIdUserLocal();
      const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
      const dataUserLocal = { ...dataLocal }
      const tmpDataFriends = [];
      for (let i = 0; i < userCurrent.friends.length; i++) {
        if (room.member.indexOf(userCurrent.friends[i]) !== -1) continue;
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
  }, [userCurrent, room])


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