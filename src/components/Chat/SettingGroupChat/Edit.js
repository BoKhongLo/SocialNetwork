import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Image,
  ScrollView,
} from "react-native";
import settingChat from "../../../styles/ChatStyles/settingStyle";
import { useNavigation, useRoute } from "@react-navigation/native";
import Item from "../cpnGroupChat/Item";
import newGroup from "../../../styles/ChatStyles/newGroupStyles";

const Edit = () => {
  // const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isViewMembersModalVisible, setViewMembersModalVisible] =
    useState(false);
  const [isAddMembersModalVisible, setAddMembersModalVisible] = useState(false);
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

  const showAddMembersModal = () => {
    setAddMembersModalVisible(true);
  };

  const hideAddMembersModal = () => {
    setAddMembersModalVisible(false);
  };

  return (
    <View style={settingChat.editContainer}>
      <View>
        <Text style={settingChat.title}>General</Text>
        <View>
                  {/** View Members Button */}
          <TouchableOpacity
            style={settingChat.editItemContainer}
            onPress={showViewMembersModal}
          >
            <Text style={settingChat.editItem}>View Members</Text>
          </TouchableOpacity>

                {/** Add members Button */}
          <TouchableOpacity
            style={settingChat.editItemContainer}
            onPress={showAddMembersModal}
          >
            <Text style={settingChat.editItem}>Add members</Text>
          </TouchableOpacity>

                {/** Modal Add Members /////////////////////////////////////////*/}
          <Modal
            animationType="slide"
            transparent={false}
            visible={showAddMembersModal}
            onRequestClose={hideAddMembersModal}
          >
          </Modal>


                {/* View Members Modal Content */}
          <Modal visible={isViewMembersModalVisible} animationType="slide">
            <TouchableOpacity onPress={hideViewMembersModal}>
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