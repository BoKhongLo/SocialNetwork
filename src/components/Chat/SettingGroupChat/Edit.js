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
import Item from "../cpnGroupChat/Item";

const Edit = () => {
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isViewMembersModalVisible, setViewMembersModalVisible] =
    useState(false);

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

export default Edit;