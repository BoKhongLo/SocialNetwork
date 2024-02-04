import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import styles from "toastify-react-native/components/styles";
import RNPickerSelect from "react-native-picker-select";
import CountryCodeDropdownPicker from "react-native-dropdown-country-picker";
import { CheckBox } from "react-native-elements";
import { ValidatePrivacyUserDto } from "../../util/dto";
import {
  getDataUserLocal,
  getAllIdUserLocal,
  updateAccessTokenAsync,
  validatePrivacyUserAsync,
  getUserDataAsync
} from "../../util";

const GenderAndPhone = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [selected, setSelected] = React.useState("+84");
  const [country, setCountry] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const route = useRoute();
  const receivedData = route.params?.data;

  const [genderOptions, setGenderOptions] = useState([
    { label: "🚹 Male", value: "male", isChecked: false },
    { label: "🚺 Female", value: "female", isChecked: false },
    { label: "🏳️‍🌈 Other", value: "other", isChecked: false },
  ]);

  useEffect(() => {
    console.log(receivedData);
    if (!receivedData) return;
    setSelected(receivedData.countryCode)
    setPhone(receivedData.phoneNumber)
    const indexGender = genderOptions.findIndex(gender => gender.value === receivedData.gender)
    if (indexGender == -1) return;
    handleCheckBoxToggle(indexGender)
  }, []);

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
  };


  const handleCheckBoxToggle = (index) => {
    const updatedOptions = [...genderOptions];
    updatedOptions[0].isChecked = false;
    updatedOptions[1].isChecked = false;
    updatedOptions[2].isChecked = false;
    updatedOptions[index].isChecked = !updatedOptions[index].isChecked;
    setGenderOptions(updatedOptions);
  };

  const handleSaveValue = async () => {
    const keys = await getAllIdUserLocal();
    const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
    let dataUserLocal = {...dataLocal}
    let dataUser = await getUserDataAsync(dataUserLocal.id, dataUserLocal.accessToken)
    if ("errors" in dataUser) {
      const dataUpdate = await updateAccessTokenAsync(dataUserLocal.id, dataUserLocal.refreshToken);
      dataUserLocal.accessToken = dataUpdate.accessToken
      dataUser = await getUserDataAsync(dataUserLocal.id, dataUserLocal.accessToken);
    }
    if ("errors" in dataUser) return;
    console.log(dataUser.detail)
    const indexGender = genderOptions.findIndex(gender => gender.isChecked === true)
    let gender = "other";
    if (indexGender !== -1) gender = genderOptions[indexGender].value;
    if (dataUser.detail.nickName == null) dataUser.detail.nickName = "";
    if (dataUser.detail.description == null) dataUser.detail.description = "";
    const dto = new ValidatePrivacyUserDto(
      dataUser.id, 
      dataUser.detail.name, 
      dataUser.detail.nickName,
      dataUser.detail.description,
      gender,
      phone,
      selected,
      );
    let dataRe = await validatePrivacyUserAsync(dto, dataUserLocal.accessToken)
    if ("errors" in dataRe) {
      const dataUpdate = await updateAccessTokenAsync(dataUserLocal.id, dataUserLocal.refreshToken);
      dataUserLocal.accessToken = dataUpdate.accessToken
      dataRe = await validatePrivacyUserAsync(dto, dataUserLocal.accessToken)
    }
    if ("errors" in dataRe) return;
    navigation.replace("Profile", { data: dataUserLocal });
  }

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <FontAwesome
          name="chevron-left"
          size={30}
          color="#333"
          onPress={() => navigation.replace('setting')}
          style={{ padding: 10 }}
        />
        <Text style={{ fontSize: 18 }}>Gender and Phone number</Text>
        <TouchableOpacity 
          style={{ padding: 5 }}
          onPress={handleSaveValue}
        >
          <Text style={{ fontSize: 18 }}>Save</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginVertical: 10 }}>
        <Text style={{ marginVertical: 10, fontSize: 20 }}>Phone Number</Text>
        <View style={[styles.inputField, { marginHorizontal: 10 }]}>
          <CountryCodeDropdownPicker
            selected={selected}
            setSelected={setSelected}
            setCountryDetails={setCountry}
            phone={phone}
            setPhone={handleSetPhone}
            countryCodeTextStyles={{ fontSize: 13 }}
          />
        </View>
        <Text style={{ marginVertical: 10, fontSize: 20 }}>Gender</Text>
        <View style={styles.inputField}>
          <View>
            {genderOptions.map((option, index) => (
              <CheckBox
                key={index}
                title={option.label}
                checked={option.isChecked}
                onPress={() => handleCheckBoxToggle(index)}
                size={30}
                textStyle={{fontSize:18}}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default GenderAndPhone;
