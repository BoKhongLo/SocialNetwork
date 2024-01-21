import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Modal from "react-native-modal";
import styles from "../../styles/styles";
import Icon from 'react-native-vector-icons/Ionicons';
const BottomTabs = ({ receivedData }) => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const route = useRoute();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  useEffect( () => {
    const fetData = async() => {
      const keys = await getAllIdUserLocal();
      const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
      receivedData = {...dataUserLocal};
    }

    fetData
  })
  return (
    <View style={styles.BottomTabContainer}>
      <TouchableOpacity
        style={{
          alignContent: "center",
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}
        onPress={() => {navigation.navigate("main")}
        }
      >
        <Icon
          style={[styles.BottomTabIcon]}
          size={30}
          name={route.name == 'main' ? 'home' :'home-outline'}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          alignContent: "center",
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}
        onPress={() => {navigation.navigate("search")}}
      >
        <Icon
          name={route.name == 'search' ? "search" : "search-outline"}
          size={30}
          style={styles.BottomTabIcon}
          // source={require("../../../assets/dummyicon/search_line.png")}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          alignContent: "center",
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}
        onPress={toggleModal}
      >
        <Icon
          style={styles.BottomTabIcon}
          size={30}
          name='add-circle-outline'
          // source={require("../../../assets/dummyicon/new.png")}
          onPress={toggleModal}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          alignContent: "center",
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}
        onPress={() => navigation.replace("Profile", { data: receivedData })}
      >
        <Icon
          style={styles.BottomTabIcon}
          size={30}
          name={route.name != "main" && route.name != "search" ? "person" : "person-outline"}
          // source={require("../../../assets/dummyicon/user.png")}
          onPress={() => navigation.navigate("Profile")}
        />
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        style={{ margin: 0, justifyContent: "flex-end" }}
        onBackdropPress={closeModal}
      >
        <View style={styles.modelContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("newpost")}
            style={[styles.modalItem, { marginLeft: 20 }]}
          >
            <Text style={styles.modalText}>Post</Text>
            <Image
              style={styles.modalIcon}
              source={require("../../../assets/dummyicon/picturepng.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("newstory")}
            style={[styles.modalItem, {}]}
          >
            <Text style={styles.modalText}>Story</Text>
            <Image
              style={styles.modalIcon}
              source={require("../../../assets/dummyicon/file_upload.png")}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};
export default BottomTabs;