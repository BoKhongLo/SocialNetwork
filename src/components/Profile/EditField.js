import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  Platform,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Divider } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import profileStyle from "../../styles/profileStyles";

import styles from "../../styles/styles";
import * as ImagePicker from "expo-image-picker";
import { FileUploadDto, ValidateUserDto } from "../../util/dto";
import {
  uploadFile,
  getDataUserLocal,
  getAllIdUserLocal,
  updateAccessTokenAsync,
  validateUserDataAsync,
} from "../../util";

const EditField = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const receivedData = route.params?.data;
  const [data, setData] = useState({} || null);

  useEffect(() => {
    console.log(receivedData);
  }, []);

  const updateData = (newData) => {
    setData((oldData) => {
      return { ...oldData, ...newData };
    });
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        flex: 1,
        marginRight: 10,
        marginLeft: 10,
      }}
    >
      <Header data={data} />
      <Divider width={1} orientation="vertical" style={{ marginBottom: 20 }} />
      <Field data={receivedData} onUpdateData={updateData} />
    </View>
  );
};

const Header = (data) => {
  const navigation = useNavigation();

  const submitInfo = async () => {
    console.log(data);
    if (data.data == null) return;

    if (!("name" in data.data) || !data.data.name) return;

    const dto = new ValidateUserDto(
      data.data.userId,
      data.data.name,
      data.data.nickName,
      data.data.description,
      data.data.avatarUrl,
      data.data.birthday
    );
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    let dataRe = await validateUserDataAsync(dto, dataUserLocal.accessToken);

    if (dataRe == null) {
      const dataUpdate = await updateAccessTokenAsync(
        dataUserLocal.id,
        dataUserLocal.refreshToken
      );
      dataRe = await validateUserDataAsync(dto, dataUpdate.accessToken);
    }

    if ("errors" in dataRe) {
      console.log(dataRe);
      return;
    }

    navigation.replace("Profile", { data: dataUserLocal });
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 13,
      }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ fontSize: 18 }}>Hủy</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 18, fontWeight: "500" }}>
        Chỉnh sửa trang cá nhân
      </Text>
      <TouchableOpacity onPress={submitInfo}>
        <Text style={{ fontSize: 18 }}>Xong</Text>
      </TouchableOpacity>
    </View>
  );
};

const Field = ({ data, onUpdateData }) => {
  const receivedData = data;
  const [avtImg, setAvtImg] = useState(receivedData.avatarUrl);
  const [name, setName] = useState(receivedData.username);
  const [nickName, setNickName] = useState(receivedData.nickName);
  const [description, setDescription] = useState(receivedData.description);

  const [date, setDate] = useState(new Date(receivedData?.birthday));
  const [showPicker, setShowPicker] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [image, setImage] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setDateOfBirth(formatDate(receivedData?.birthday));
    const dataInit = {
      name: receivedData.username,
      nickName: receivedData.nickName,
      description: receivedData.description,
      birthday: receivedData.birthday,
      userId: receivedData.id,
    };
    if (typeof receivedData.avatarUrl === "object") {
      dataInit.avatarUrl = receivedData.avatarUrl.uri;
    } else {
      dataInit.avatarUrl = null;
    }
    onUpdateData(dataInit);
  }, []);

  const chooseModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleNameChange = (text) => {
    setName(text);
    onUpdateData({ name: text });
  };

  const handleNickNameChange = (text) => {
    setNickName(text);
    onUpdateData({ nickName: text });
  };

  const handleDescriptionChange = (text) => {
    setDescription(text);
    onUpdateData({ description: text });
  };

  const editAvaImg = async (validate) => {
    if (validate === "Camera") {
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
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setAvtImg({ uri: result.assets[0].uri });
        const keys = await getAllIdUserLocal();
        const dto = new FileUploadDto(receivedData.id, result.assets[0].uri, "userAvatar.jpg", "image/jpeg");
        const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
        let data = await uploadFile(dto, dataLocal.accessToken);
        if (data == null) {
          const dataUpdate = await updateAccessTokenAsync(
            dataLocal.id,
            dataLocal.refreshToken
          );
          data = await uploadFile(dto, dataUpdate.accessToken);
        }
        setAvtImg({ uri: data.url });
        onUpdateData({ avatarUrl: data.url });
      }
    } else if (validate === "Gallery") {
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

      if (!result.canceled) {
        setImage(result.assets[0].uri);

        const keys = await getAllIdUserLocal();
        const dto = new FileUploadDto(receivedData.id, result.assets[0].uri, "userAvatar.jpg", "image/jpeg");
        const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
        let data = await uploadFile(dto, dataLocal.accessToken);
        if (data == null) {
          const dataUpdate = await updateAccessTokenAsync(
            dataLocal.id,
            dataLocal.refreshToken
          );
          data = await uploadFile(dto, dataUpdate.accessToken);
        }
        setAvtImg({ uri: data.url });
        onUpdateData({ avatarUrl: data.url });
      }
    }
  };

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };
  const formatDate = (rawDate) => {
    let date = new Date(rawDate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
    return `${day}-${month}-${year}`;
  };
  const setDateTime = ({ type }, selectDate) => {
    if (type == "set") {
      const currentDate = selectDate;
      setDate(currentDate);
      onUpdateData({ birthday: formatDate(currentDate) });

      if (Platform.OS === "android") {
        toggleDatePicker();
        setDateOfBirth(formatDate(currentDate));
      }
    } else {
      toggleDatePicker();
    }
  };

  const confirmIOSDate = () => {
    setDateOfBirth(formatDate(date));
    toggleDatePicker();
  };
  return (
    <View>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity onPress={chooseModal}>
          <Image
            style={{
              width: 90,
              height: 90,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: "black",
              marginBottom: 10,
            }}
            source={avtImg}
          />
        </TouchableOpacity>
        <Text style={{ marginBottom: 10 }}>Chỉnh sửa avatar</Text>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={chooseModal}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            onPress={chooseModal}
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
                onPress={() => editAvaImg("Camera")}
              >
                <Text style={{ fontSize: 20 }}>Camera</Text>
                <Image
                  style={{ height: 30, width: 30, marginLeft: 15 }}
                  source={require("../../../assets/dummyicon/camera_2_line.png")}
                />
              </TouchableOpacity>
              <Divider width={1} orientation="vertical" />
              <TouchableOpacity
                style={{
                  paddingHorizontal: 70,
                  paddingVertical: 20,
                  flexDirection: "row",
                }}
                onPress={() => editAvaImg("Gallery")}
              >
                <Text style={{ fontSize: 20 }}>
                  Gallery
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
      <Divider width={1} orientation="vertical" style={{ marginBottom: 20 }} />

      <View style={profileStyle.fieldContainer}>
        <Text style={profileStyle.textField}>Tên</Text>
        <TextInput
          style={profileStyle.inputField}
          value={name}
          onChangeText={handleNameChange}
          maxLength={25}
        />
      </View>
      <View style={profileStyle.fieldContainer}>
        <Text style={profileStyle.textField}>Biệt danh</Text>
        <TextInput
          style={profileStyle.inputField}
          value={nickName}
          onChangeText={handleNickNameChange}
          maxLength={25}
        />
      </View>
      <View style={profileStyle.fieldContainer}>
        <Text style={profileStyle.textField}>Tiểu sử</Text>
        <TextInput
          style={profileStyle.inputField}
          value={description}
          onChangeText={handleDescriptionChange}
        />
      </View>
      <View style={profileStyle.fieldContainer}>
        <Text style={profileStyle.textField}>Ngày tháng năm sinh</Text>
        {showPicker && (
          <DateTimePicker
            mode="date"
            display="spinner"
            value={date}
            onChange={setDateTime}
          />
        )}
        {!showPicker && Platform.OS === "ios" && (
          <View
            style={{ flexDirection: "Row", justifyContent: "space-around" }}
          >
            <TouchableOpacity
              style={[styles.buttonLogin, { backgroundColor: "#11182711" }]}
              onPress={toggleDatePicker}
            >
              <Text style={[styles.buttonLoginText, { color: "#075985" }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonLogin]}
              onPress={confirmIOSDate}
            >
              <Text style={styles.buttonLoginText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        )}

        {!showPicker && (
          <Pressable onPress={toggleDatePicker}>
            <TextInput
              placeholderTextColor="#11182744"
              placeholder="Ngày tháng năm sinh"
              style={profileStyle.inputField}
              value={dateOfBirth}
              editable={false}
              onChangeText={(text) => setDateOfBirth(text)}
              onPressIn={toggleDatePicker}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default EditField;