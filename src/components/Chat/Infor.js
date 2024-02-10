import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput
} from "react-native";
import React, { useState, useEffect } from "react";
import settingChat from "../../styles/ChatStyles/settingStyle";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  getAllIdUserLocal,
  getDataUserLocal,
  updateAccessTokenAsync,
  validateRoomchatAsync,
  uploadFile
} from "../../util";

import { ValidateRoomchatDto, FileUploadDto } from "../../util/dto"
import * as ImagePicker from "expo-image-picker";

const Infor = ({ receivedData, userCurrent, onEdit }) => {
  const [modalChangeAvatar, setModalChangeAvatar] = useState(false);
  const [modalChangeTitle, setModalChangeTitle] = useState(false);
  const [typeButton, setTypeButton] = useState("edit");
  const [newTitle, setNewTitle] = useState(receivedData.title)
  const [dataRoom, setDataRoom] = useState(receivedData)
  const [dataUser, setDataUser] = useState(userCurrent)
  const [isMod, setIsMod] = useState(false)

  useEffect(() => {
    setDataRoom(receivedData)
    setNewTitle(receivedData.title)
    setDataUser(userCurrent)
    if (!receivedData) return;
    if (!userCurrent) return;
    if (receivedData.role.ADMIN.findIndex(item => item.memberId === userCurrent.id) !== -1) setIsMod(true)
    if (receivedData.role.MOD.findIndex(item => item.memberId === userCurrent.id) !== -1) setIsMod(true)

  }, [receivedData, userCurrent])

  const pressModalChangeAvatar = () => {
    setModalChangeAvatar(!modalChangeAvatar);
  };

  const pressModalChangeTitle = () => {
    if (!dataRoom) return;
    if (!dataUser) return;
    setModalChangeTitle(!modalChangeTitle);
    if (modalChangeTitle == false) {
      setTypeButton("edit");
      setNewTitle(dataRoom.title)
    }
  };

  const handleChangeTitle = async () => {
    if (!dataRoom) return;
    if (!dataUser) return;
    if (typeButton == "edit") {
      setTypeButton("check");
      return;
    }
    else if (typeButton == "check") {
      const dto = new ValidateRoomchatDto(dataRoom.id, dataRoom.id, newTitle, dataRoom.description, dataRoom.imgDisplay)
      const keys = await getAllIdUserLocal();
      const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
      const dataRe = await validateRoomchatAsync(dto, dataLocal.accessToken)
      if ("errors" in dataRe) {
        let dataUpdate = await updateAccessTokenAsync(
          dataLocal.id,
          dataLocal.refreshToken
        );
        dataRe = await validateRoomchatAsync(dto, dataUpdate.accessToken)
      }
      if ("errors" in dataRe) return;
      console.log(dataRe);
      setDataRoom((preData) => {
        let newData = { ...preData };
        newData.title = newTitle;
        return newData;
      })
      setModalChangeTitle(!modalChangeTitle);
    }
  }

  const handleChangeImgDisplay = async (validate) => {
    if (!dataRoom) return;
    if (!dataUser) return;
    if (validate === "Camera") {
      onEdit(true);
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermission.granted === false) {
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log(result);
      onEdit(false)
      if (!result.canceled) {
        onEdit(true);
        const keys = await getAllIdUserLocal();
        const dto = new FileUploadDto(dataUser.id, result.assets[0].uri, `avatarGroup${dataRoom.id}.jpg`, "image/jpeg");
        const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
        const dataUserLocal = { ...dataLocal };
        let data = await uploadFile(dto, dataUserLocal.accessToken);
        if (data == null) {
          let dataUpdate = await updateAccessTokenAsync(
            dataUserLocal.id,
            dataUserLocal.refreshToken
          );
          dataUserLocal.accessToken == dataUpdate.accessToken;
          data = await uploadFile(dto, dataUpdate.accessToken);
        }
        onEdit(false)
        if (data == null) return;
        const dtoValidate = new ValidateRoomchatDto(dataUser.id, dataRoom.id, dataRoom.title, dataRoom.description, data.url)
        const dataRe = await validateRoomchatAsync(dtoValidate, dataUserLocal.accessToken)
        if ("errors" in dataRe) {
          dataUpdate = await updateAccessTokenAsync(
            dataUserLocal.id,
            dataUserLocal.refreshToken
          );
          dataUserLocal.accessToken == dataUpdate.accessToken;
          dataRe = await validateRoomchatAsync(dto, dataUpdate.accessToken)
        }
        if ("errors" in dataRe) return;
        setDataRoom((preData) => {
          let newData = { ...preData };
          newData.imgDisplay = data.url;
          return newData;
        })
        setModalChangeAvatar(!modalChangeAvatar)
      }
    } else if (validate === "Gallery") {
      onEdit(true);
      const galleryPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (galleryPermission.granted === false) {
        return;
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log(result);
      onEdit(false)
      if (!result.canceled) {
        onEdit(true);
        const keys = await getAllIdUserLocal();
        const dto = new FileUploadDto(dataUser.id, result.assets[0].uri, `avatarGroup${dataRoom.id}.jpg`, "image/jpeg");
        const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
        const dataUserLocal = { ...dataLocal };
        let data = await uploadFile(dto, dataUserLocal.accessToken);
        if (data == null) {
          let dataUpdate = await updateAccessTokenAsync(
            dataUserLocal.id,
            dataUserLocal.refreshToken
          );
          dataUserLocal.accessToken == dataUpdate.accessToken;
          data = await uploadFile(dto, dataUpdate.accessToken);
        }
        console.log(data)
        onEdit(false)
        if (data == null) return
        const dtoValidate = new ValidateRoomchatDto(dataUser.id, dataRoom.id, dataRoom.title, dataRoom.description, data.url)
        const dataRe = await validateRoomchatAsync(dtoValidate, dataUserLocal.accessToken)
        if ("errors" in dataRe) {
          dataUpdate = await updateAccessTokenAsync(
            dataUserLocal.id,
            dataUserLocal.refreshToken
          );
          dataUserLocal.accessToken == dataUpdate.accessToken;
          dataRe = await validateRoomchatAsync(dto, dataUpdate.accessToken)
        }
        console.log(dataRe)
        if ("errors" in dataRe) return;
        setDataRoom((preData) => {
          let newData = { ...preData };
          newData.imgDisplay = data.url;
          return newData;
        })
        setModalChangeAvatar(!modalChangeAvatar)
      }
    }
  }

  return (
    <View style={settingChat.avtContainer}>


      <View
        style={{
          flexDirection: "row",
          marginBottom: 10,
          alignItems: 'flex-end'
        }}
      >
        {dataRoom && dataRoom.imgDisplay ? (
          <Image style={settingChat.avt} source={{ uri: dataRoom.imgDisplay }} />
        ) : (
          <Image
            style={settingChat.avt}
            source={require("../../../assets/img/avt.png")}
          />)}
        {dataRoom.isSingle == false && isMod && (
          <TouchableOpacity
            style={{

            }}
          >
            <FontAwesome
              name="edit"
              size={20}
              color="black"
              style={{ marginLeft: 2 }}
            />
          </TouchableOpacity>
        )}


      </View>

      <View>
        <Modal
          animationType="fade"
          visible={modalChangeAvatar}
          transparent={true}
          onRequestClose={pressModalChangeAvatar}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            onPress={pressModalChangeAvatar}
          >
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  paddingHorizontal: 70,
                  paddingVertical: 20,
                  flexDirection: "row",
                }}
                onPress={async () => await handleChangeImgDisplay("Camera")}
              >
                <Text style={{ fontSize: 20 }}>{"Camera"}</Text>
                <Image
                  style={{ height: 30, width: 30, marginLeft: 15 }}
                  source={require("../../../assets/dummyicon/camera_2_line.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 70,
                  paddingVertical: 20,
                  flexDirection: "row",
                }}
                onPress={async () => await handleChangeImgDisplay("Gallery")}
              >
                <Text style={{ fontSize: 20 }}>
                  {"Gallery"}
                </Text>
                <Image
                  style={{ height: 30, width: 30, marginLeft: 20 }}
                  source={require("../../../assets/dummyicon/file_upload.png")}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginBottom: 20,
          alignItems: 'flex-end',
        }}
      >
        <Text style={settingChat.name}>{dataRoom.title}</Text>
        {dataRoom.isSingle == false && isMod && (
          <TouchableOpacity
            style={{
              alignSelf: "flex-end"
            }}
            onPress={pressModalChangeTitle}
          >
            <FontAwesome
              name="edit"
              size={17}
              color="black"
              style={{ textAlignVertical: "bottom", marginBottom: 2 }}
            />
          </TouchableOpacity>
        )}
      </View>
      <View>
        <Modal
          animationType="fade"
          visible={modalChangeTitle}
          transparent={true}
          onRequestClose={pressModalChangeTitle}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            onPress={pressModalChangeTitle}
          >
            <View
              style={{
                backgroundColor: "white",
                height: 100,
                width: 350,
                borderRadius: 10,
              }}
            >
              <View style={settingChat.nicknameItem}>
                <View style={settingChat.textInputContainer}>
                  <TextInput
                    style={{
                      marginLeft: 10,
                      padding: 10,
                      fontSize: 18,
                      color: "black",
                      borderBottomWidth: 1,
                    }}
                    editable={typeButton === "edit" ? false : true}
                    value={newTitle}
                    placeholder={dataRoom.title}
                    onChangeText={(text) => setNewTitle(text)}
                  />
                </View>
                <TouchableOpacity
                  style={{ marginTop: 15 }}
                  onPress={async () => await handleChangeTitle()}
                >
                  <Text>
                    <FontAwesome name={typeButton} size={30} color="#333" />
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </View>
  );
};

export default Infor;
