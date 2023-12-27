import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Picker } from "@react-native-picker/picker";
import styles from "../../styles/styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { color } from "react-native-elements/dist/helpers";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const renderDays = () => {
    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
    return days.map((day) => <Picker.Item key={day} label={day} value={day} />);
  };

  const renderMonths = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months.map((month, index) => (
      <View>
        <Picker.Item key={index} label={month} value={month} />
      </View>
    ));
  };

  const renderYears = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) =>
      (currentYear - i).toString()
    );
    return years.map((year) => (
      <Picker.Item key={year} label={year} value={year} />
    ));
  };
  const handleSignUp = () => {
    console.log("SignUp clicked");
    // Thêm logic đăng ký của bạn ở đây
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.inputField}>
        <TextInput
          placeholderTextColor="#444"
          placeholder="Số điện thoại hoặc Email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoFocus={true}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={[styles.inputField, { flex: 1 }]}>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <View>
              <Text> Day</Text>
            </View>
            <Picker
              style= {{padding:5}}
              placeholder="Day"
              selectedValue={selectedDay}
              onValueChange={(itemValue) => setSelectedDay(itemValue)}
            >
              {renderDays()}
            </Picker>
          </View>
        </View>
        <View style={[styles.inputField, { flex: 1 }]}>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <View>
              <Text> Year </Text>
            </View>
            <Picker
              style= {{padding:5}}
              placeholder="Day"
              selectedValue={selectedDay}
              onValueChange={(itemValue) => setSelectedDay(itemValue)}
            >
              {renderDays()}
            </Picker>
          </View>
        </View>
        <View style={[styles.inputField, { flex: 1 }]}>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <View>
              <Text> Year </Text>
            </View>
            <Picker
              style= {{padding:5}}
              placeholder="Day"
              selectedValue={selectedDay}
              onValueChange={(itemValue) => setSelectedDay(itemValue)}
            >
              {renderDays()}
            </Picker>
          </View>
        </View>
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
