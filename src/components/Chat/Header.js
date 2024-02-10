import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { Toast } from "toastify-react-native";
import ToastManager from "toastify-react-native";

import chatStyles from "../../styles/ChatStyles/chatStyles";
import chat from "../../styles/ChatStyles/chatStyles";
import styles from "../../styles/styles";
import newGroup from "../../styles/ChatStyles/newGroupStyles";
import Item from "./cpnGroupChat/Item";

import {
  getUserDataLiteAsync,
  getAllIdUserLocal,
  getDataUserLocal,
  updateAccessTokenAsync,
  createRoomchatAsync,
} from "../../util";

import { RoomchatDto } from "../../util/dto";

const Header = ({ user, updateRoom }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupMember, setGroupMember] = useState([]);
  const [dataFriends, setDataFriends] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const keys = await getAllIdUserLocal();
      const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
      const dataUserLocal = { ...dataLocal };
      const tmpDataFriends = [];
      for (let i = 0; i < user.friends.length; i++) {
        let dataReturn = await getUserDataLiteAsync(
          user.friends[i],
          dataUserLocal.accessToken
        );

        if ("errors" in dataReturn) {
          const dataUpdate = await updateAccessTokenAsync(
            dataUserLocal.id,
            dataUserLocal.refreshToken
          );
          dataUserLocal.accessToken = dataUpdate.accessToken;
          dataReturn = await getUserDataLiteAsync(
            user.friends[i],
            dataUpdate.accessToken
          );
        }
        tmpDataFriends.push(dataReturn);
      }
      setDataFriends(tmpDataFriends);
    };
    fetchData();
  }, [user]);

  const updateMember = (userId) => {
    setGroupMember((preGroup) => [...preGroup, userId]);
  };

  const removeMember = (userId) => {
    setGroupMember((preGroup) =>
      preGroup.filter((member) => member !== userId)
    );
  };
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const handleCreateGroup = async () => {
    if (groupMember.length == 0 || groupName == "") {
      return Toast.error("Add a name or members");
    }

    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    const dataUpdate = await updateAccessTokenAsync(
      dataUserLocal.id,
      dataUserLocal.refreshToken
    );
    console.log("Group name:", groupName);
    const dto = new RoomchatDto(
      dataUserLocal.id,
      [...groupMember],
      groupName,
      false
    );
    let dataReturn = await createRoomchatAsync(dto, dataUpdate.accessToken);
    console.log(dataReturn)
    updateRoom(dataReturn);
    if ("errors" in dataReturn) {
      console.log(dataReturn.errors);
      return;
    }
    closeModal();
  };
  return (
    <View>
      <View style={chatStyles.headerContainer}>
        <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
          <TouchableOpacity onPress={() => navigation.navigate("main")}>
            <Image
              style={styles.iconforAll}
              source={require("../../../assets/dummyicon/left_line_64.png")}
            />
          </TouchableOpacity>
          <Text style={chatStyles.userNameStyles}> {user.username} </Text>
        </View>
        <View>
          <TouchableOpacity onPress={openModal}>
            <Image
              style={chat.createIcon}
              source={require("../../../assets/dummyicon/newdot_line.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Divider width={1} orientation="vertical" />

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <ToastManager />

        <View style={newGroup.modalContainer}>
          <View style={newGroup.headerContainer}>
            <TouchableOpacity style={newGroup.button} onPress={closeModal}>
              <Text style={newGroup.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={newGroup.buttonText}>New Group</Text>
            <TouchableOpacity
              style={newGroup.button}
              onPress={async () => await handleCreateGroup()}
            >
              <Text style={newGroup.buttonText}>Create</Text>
            </TouchableOpacity>
          </View>
          <View style={newGroup.textInputContainer}>
            <TextInput
              placeholder="Enter group name"
              style={[newGroup.text, { marginLeft: 10 }]}
              onChangeText={(text) => setGroupName(text)}
              value={groupName}
            />
          </View>
          <View>
            <ScrollView>
              {dataFriends.map((friend, index) => (
                <Item
                  key={friend.id}
                  user={friend}
                  onAdd={updateMember}
                  onRemove={removeMember}
                  typeItem={"ADDMEMBER"}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Header;
