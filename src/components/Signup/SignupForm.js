import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform, Pressable } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from "../../styles/styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { color } from "react-native-elements/dist/helpers";
import { SignupAsync, getUserDataAsync } from '../../util'
import { SignUpDto } from '../../util/dto'
const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
  const handleSignUp = async () => {
    console.log("SignUp clicked");
    const dto = new SignUpDto();
    dto.email = email;
    dto.password = password;
    dto.name = name;
    dto.phoneNumber = phoneNumber;
    dto.birthday = dateOfBirth;

    const data = await SignupAsync(dto);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.inputField}>
        <TextInput
          placeholderTextColor="#444"
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoFocus={true}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
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
              placeholder="The birthday"
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
          placeholder="Mật khẩu"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          textContentType="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <View style={styles.inputField}>
        <TextInput
          placeholderTextColor="#444"
          placeholder="Xác nhận mật khẩu"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          textContentType="password"
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
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
        onPress={() => handleSignUp()}
      >
        <Text style={styles.buttonLoginText}> Đăng ký </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupForm;
