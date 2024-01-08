import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../../styles/styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { color } from "react-native-elements/dist/helpers";
import { SignupAsync, getUserDataAsync } from "../../util";
import { SignUpDto } from "../../util/dto";

import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SignupForm = () => {
  const route = useRoute();
  const receivedData = route.params?.data;
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      if (receivedData == null) {
        navigation.navigate('Login');
      }};
    fetchData();
  }, []);

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

  const handleSignUp = async () => {
    console.log("SignUp clicked");
    const dto = new SignUpDto();
    dto.email = receivedData.email;
    dto.password = receivedData.password;
    dto.name = name;
    dto.phoneNumber = parseFloat(phoneNumber.replace(/\D/g, ''));
    dto.birthday = dateOfBirth;

    try {
      const dataSignUp = await SignupAsync(dto);
      if (dataSignUp != null && dataSignUp != undefined) {
        navigation.navigate("main", { data: dataSignUp });
      }
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <View style={styles.wrapper}>
      <View style={styles.inputField}>
        <TextInput
          placeholderTextColor="#444"
          placeholder="Name"
          autoCapitalize="none"
          autoFocus={true}
          value={name}
          onChangeText={(text) => setName(text)}
        />
      </View>
      <View style={styles.inputField}>
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
              placeholder="Month - Date - Year"
              value={dateOfBirth}
              editable={false}
              onChangeText={(text) => setDateOfBirth(text)}
              onPressIn={toggleDatePicker}
            />
          </Pressable>
        )}
      </View>
      <View style={styles.inputField}>
        <TextInput
          placeholderTextColor="#444"
          placeholder="Số điện thoại"
          autoCapitalize="none"
          keyboardType="number-pad"
          textContentType="telephoneNumber"
          autoFocus={true}
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
        />
      </View>
      <TouchableOpacity
        titleSize={20}
        style={styles.buttonLogin}
        onPress={handleSignUp}
      >
        <Text style={styles.buttonLoginText}> Submit </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupForm;
