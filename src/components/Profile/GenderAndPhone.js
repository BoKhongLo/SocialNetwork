import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import styles from "toastify-react-native/components/styles";
import RNPickerSelect from "react-native-picker-select";
import CountryCodeDropdownPicker from "react-native-dropdown-country-picker";
import { CheckBox } from "react-native-elements";

const GenderAndPhone = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [selected, setSelected] = React.useState("+84");
  const [country, setCountry] = React.useState("");
  const [phone, setPhone] = React.useState("");
//   const [isChecked, setIsChecked] = useState(false);

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

  const [genderOptions, setGenderOptions] = useState([
    { label: "🚹 Male", value: "male", isChecked: false },
    { label: "🚺 Female", value: "female", isChecked: false },
    { label: "🏳️‍🌈 Other", value: "other", isChecked: false },
  ]);

  const handleCheckBoxToggle = (index) => {
    const updatedOptions = [...genderOptions];
    updatedOptions[index].isChecked = !updatedOptions[index].isChecked;
    setGenderOptions(updatedOptions);
  };
  //   const handleCheckBoxToggle = () => {
  //     setIsChecked(!isChecked);
  //   };
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
          onPress={() => navigation.goBack()}
          style={{ padding: 10 }}
        />
        <Text style={{ fontSize: 18 }}>Gender and Phone number</Text>
        <TouchableOpacity style={{ padding: 5 }}>
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
