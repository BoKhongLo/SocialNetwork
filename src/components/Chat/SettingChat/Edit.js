import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Image,
} from "react-native";
import settingChat from "../../../styles/ChatStyles/settingStyle";
import { useNavigation, useRoute } from "@react-navigation/native";

const Edit = () => {
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

  return (
    <View style={settingChat.editContainer}>
      <View>
        <Text style={settingChat.title}>General</Text>
        <View>
          {/* <TouchableOpacity
            style={settingChat.editItemContainer}
            onPress={showEditAvatarModal}
          >
            <Text style={settingChat.editItem}>Edit avatar</Text>
          </TouchableOpacity>
          <Modal visible={isEditAvatarModalVisible} animationType="slide">
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Edit Avatar Modal</Text>
              <Button title="Close" onPress={hideEditAvatarModal} />
            </View>
          </Modal> */}

          <TouchableOpacity
            style={settingChat.editItemContainer}
            onPress={() => null}
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
              <TouchableOpacity onPress={hideNicknameModal}>
                <Image
                  style={settingChat.button}
                  source={require("../../../../assets/dummyicon/left_line_64.png")}
                />
              </TouchableOpacity>
              <View style={settingChat.nicknameContainer}>
                <View style={settingChat.nicknameItem}>
                  <Image style={settingChat.avtCustom} />
                  <View style={settingChat.textInputContainer}>
                    <TextInput
                      style={{
                        marginLeft: 10,
                        padding: 10,
                        fontSize: 18,
                      }}
                      placeholder="Nickname 1"
                      onChangeText={(text) => {
                        // Handle text input changes for the first nickname
                        console.log("Nickname 1:", text);
                      }}
                      onBlur={() => {
                        // Handle onBlur event for the first nickname
                        console.log("Nickname 1 blurred");
                      }}
                    />
                  </View>
                </View>
                <View style={settingChat.nicknameItem}>
                  <Image style={settingChat.avtCustom} />
                  <View style={settingChat.textInputContainer}>
                    <TextInput
                      style={{
                        marginLeft: 10,
                        padding: 10,
                        fontSize: 18,
                      }}
                      placeholder="Nickname 2"
                      onChangeText={(text) => {
                        // Handle text input changes for the second nickname
                        console.log("Nickname 2:", text);
                      }}
                      onBlur={() => {
                        // Handle onBlur event for the second nickname
                        console.log("Nickname 2 blurred");
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{ justifyContent: "flex-end", flexDirection: "row" }}
                >
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderRadius: 10,
                      backgroundColor: "#D3D3D3",
                      margin: 5,
                    }}
                    onPress={() => {
                      // Handle save button press
                      console.log("Save button pressed");
                      // You can add logic here to save the nicknames or perform any other actions.
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderRadius: 10,
                      backgroundColor: "#D3D3D3",
                      margin: 5,
                    }}
                    onPress={() => {
                      // Handle save button press
                      console.log("Save button pressed");
                      // You can add logic here to save the nicknames or perform any other actions.
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>Clear</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        <View>
          <Text style={settingChat.title}>Privacy</Text>
          <TouchableOpacity style={settingChat.editItemContainer}>
            <Text style={settingChat.editItem}>Block User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={settingChat.editItemContainer}>
            <Text style={settingChat.editItem}>Hide</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Edit;
