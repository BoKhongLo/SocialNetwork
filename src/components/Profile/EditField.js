import { View, Text, Image, TextInput, Pressable, Platform } from "react-native";
import React, {useState} from "react";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Divider } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import DateTimePicker from '@react-native-community/datetimepicker';
import profileStyle from "../../styles/profileStyles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRoute } from "@react-navigation/native"
import styles from "../../styles/styles";

const EditField = () => {
  const insets = useSafeAreaInsets();
  
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
      <Header />
      <Divider width={1} orientation="vertical" style={{ marginBottom: 20 }} />
      <Field />
    </View>
  );
};

const Header = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 13,
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Text style={{ fontSize: 18 }}>Hủy </Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 18, fontWeight: "500" }}>
        Chỉnh sửa trang cá nhân
      </Text>
      <TouchableOpacity>
        <Text style={{ fontSize: 18 }}>Xong</Text>
      </TouchableOpacity>
    </View>
  );
};

const Field = () => {
  const route = useRoute();
  const [receivedData, setReceivedData] = useState(route.params?.data || null);
  const [name, setName] = useState(receivedData.username);
  const [nickName, setNickName] = useState(receivedData.nickName);
  const [description, setDescription] = useState(receivedData.description);

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");

  const toggleDatePicker = () => {
    setShowPicker(!showPicker)
  }
  const formatDate = (rawDate) => {
    let date = new Date(rawDate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
    return `${day}-${month}-${year}`

  }
  const setDateTime = ({ type }, selectDate) => {
    if (type == "set") {
      const currentDate = selectDate;
      setDate(currentDate)

      if (Platform.OS === "android") {
        toggleDatePicker()
        setDateOfBirth(formatDate(currentDate))
      }
    }
    else {
      toggleDatePicker()
    }
  };

  const confirmIOSDate = () => {
    setDateOfBirth(formatDate(date))
    toggleDatePicker()
  }
  return (
    <View>
      <View style={{ alignItems: "center" }}>
        <Image
          style={{
            width: 90,
            height: 90,
            borderRadius: 50,
            borderWidth: 1,
            borderColor: "black",
            marginBottom: 10,
          }}
        />
        <Text style={{ marginBottom: 10 }}>Chỉnh sửa avatar</Text>
      </View>
      <Divider width={1} orientation="vertical" style={{ marginBottom: 20 }} />

      <View style={profileStyle.fieldContainer}>
        <Text style={profileStyle.textField}>Tên</Text>
        <TextInput 
        style={profileStyle.inputField} 
        value={name}
        onChangeText={(text) => setName(text)}
        />
      </View>
      <View style={profileStyle.fieldContainer}>
        <Text style={profileStyle.textField}>Biệt danh</Text>
        <TextInput style={profileStyle.inputField} 
            value={nickName}
            onChangeText={(text) => setNickName(text)}
         />
      </View>
      <View style={profileStyle.fieldContainer}>
        <Text style={profileStyle.textField}>Tiểu sử</Text>
        <TextInput style={profileStyle.inputField} 
            value={description}
            onChangeText={(text) => setDescription(text)}
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
            <TouchableOpacity style={[
              styles.buttonLogin,
              { backgroundColor: "#11182711" }
            ]}
              onPress={toggleDatePicker}
            >
              <Text
                style={[styles.buttonLoginText,
                { color: "#075985" }]
                }
              >
                Cancel
              </Text>
            </TouchableOpacity>


            <TouchableOpacity style={[
              styles.buttonLogin,
            ]}
              onPress={confirmIOSDate}
            >
              <Text
                style={styles.buttonLoginText}
              >
                Confirm
              </Text>
            </TouchableOpacity>
          </View>

        )}

        {!showPicker && (
          <Pressable
            onPress={toggleDatePicker}
          >
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
