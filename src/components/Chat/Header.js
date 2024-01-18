import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

import chatStyles from "../../styles/ChatStyles/chatStyles";
import chat from "../../styles/ChatStyles/chatStyles";
import styles from "../../styles/styles";
import newGroup from "../../styles/ChatStyles/newGroupStyles";
import Item from "./cpnGroupChat/Item";

const Header = ({ user }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState("");

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const handleCreateGroup = () => {
    // Handle the logic for creating a group with the entered group name
    console.log("Group name:", groupName);
    // Close the modal after handling the creation logic
    closeModal();
  };
  return (
    <View>
      <View style={chatStyles.headerContainer}>
        <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
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
        <View style={newGroup.modalContainer}>
          <View style={newGroup.headerContainer}>
            <TouchableOpacity style={newGroup.button} onPress={closeModal}>
              <Text style={newGroup.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={newGroup.buttonText}>New Group</Text>
            <TouchableOpacity style={newGroup.button}>
              <Text style={newGroup.buttonText}>Create</Text>
            </TouchableOpacity>
          </View>
          <View style={newGroup.textInputContainer}>
            <TextInput
              placeholder="Enter group name"
              style={[newGroup.text,{marginLeft:10}]}
              onChangeText={(text) => setGroupName(text)}
              value={groupName}
            />
          </View>
          <View>
            <Item />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Header;