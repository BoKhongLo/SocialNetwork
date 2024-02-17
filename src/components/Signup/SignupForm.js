import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Pressable,
  ScrollView,
  Alert
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../../styles/styles";
import { SignupAsync, getUserDataAsync } from "../../util";
import { SignUpDto } from "../../util/dto";

import { useNavigation, useRoute } from '@react-navigation/native';
import { Toast } from 'toastify-react-native'
import RNPickerSelect from 'react-native-picker-select';
import CountryCodeDropdownPicker from 'react-native-dropdown-country-picker'

const SignupForm = ({receivedData, isLoading, setIsLoading}) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const navigation = useNavigation();
  const [selectedGender, setSelectedGender] = useState("other");
  const [selected, setSelected] = React.useState('+84');
  const [country, setCountry] = React.useState('');
  const [phone, setPhone] = React.useState('');

  const handleSetPhone = (text) => {
    if (text == "") {
      setPhone("");
      return;
    }
    if (text.startsWith("0")) {
      return;
    }
    const numberRegex = /^[0-9]+$/;
    if (numberRegex.test(text)) {
      setPhone(text);
    } else {
      return;
    }
  }

  const genderOptions = [
    { label: '🚹male', value: 'male' },
    { label: '🚺female', value: 'female' },
    { label: '🏳️‍🌈other', value: 'other' },
  ];


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
    setIsLoading(true); 
    console.log("SignUp clicked");
    const dto = new SignUpDto();
    dto.email = receivedData.email;
    dto.password = receivedData.password;
    if (name === "" ) {
      Toast.error("Name must not be empty!")
      setIsLoading(false);
      return 
    }
    dto.name = name;
    if (phone === "") {
      dto.phoneNumber = null;
      dto.countryCode = null;
    }
    else {
      dto.phoneNumber = phone;
      dto.countryCode = selected;
    }

    dto.birthday = date.toISOString();
    dto.otpId = receivedData.otpId;
    dto.gender = selectedGender;
    console.log(dto)
    setIsLoading(false);
    const dataSignUp = await SignupAsync(dto);
    console.log(dataSignUp)
    if ("errors" in dataSignUp) {
      Alert.alert(dataSignUp.errors[0].message);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    navigation.navigate("main", { data: dataSignUp });

  };


  return (
    <View style={styles.wrapper}>
      <ScrollView>
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
          <RNPickerSelect 
            onValueChange={(value) => setSelectedGender(value)}
            items={genderOptions}
            value={selectedGender}
          />
      </View>
      <View style={styles.inputField}>
        <CountryCodeDropdownPicker 
          selected={selected} 
          setSelected={setSelected}
          setCountryDetails={setCountry} 
          phone={phone} 
          setPhone={handleSetPhone} 
          countryCodeTextStyles={{fontSize: 13}}
        />
      </View>
      {/* <View style={styles.inputField}>
        <TextInput
          placeholderTextColor="#444"
          placeholder="phone number"
          autoCapitalize="none"
          keyboardType="number-pad"
          textContentType="telephoneNumber"
          autoFocus={true}
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
        />
      </View> */}
      <TouchableOpacity
        titleSize={20}
        style={styles.buttonLogin}
        onPress={handleSignUp}
      >
        <Text style={styles.buttonLoginText}> Submit </Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SignupForm;
