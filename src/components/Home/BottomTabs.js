import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import styles from "../../styles/styles";
const BottomTabs = ({ receivedData }) => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

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
        onPress={() => navigation.navigate("main")}
      >
        <Image
          style={[styles.BottomTabIcon]}
          source={require("../../../assets/dummyicon/home_6_line.png")}
          onPress={() => console.log("da nhan nut home")}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          alignContent: "center",
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}
        onPress={() => navigation.navigate("search")}
      >
        <Image
          style={styles.BottomTabIcon}
          source={require("../../../assets/dummyicon/search_line.png")}
          onPress={() => console.log("da nhan nut search")}
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
        <Image
          style={styles.BottomTabIcon}
          source={require("../../../assets/dummyicon/new.png")}
          onPress={() => console.log("da nhan nut create post")}
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
        <Image
          style={styles.BottomTabIcon}
          source={require("../../../assets/dummyicon/user.png")}
          onPress={() => console.log("da nhan nut user site")}
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