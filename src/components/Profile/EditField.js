import { View, Text, Image, TextInput } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Divider } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import profileStyle from "../../styles/profileStyles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
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
        <TextInput style={profileStyle.inputField} placeholder="" />
      </View>
      <View style={profileStyle.fieldContainer}>
        <Text style={profileStyle.textField}>Biệt danh</Text>
        <TextInput style={profileStyle.inputField} placeholder="" />
      </View>
      <View style={profileStyle.fieldContainer}>
        <Text style={profileStyle.textField}>Tiểu sử</Text>
        <TextInput style={profileStyle.inputField} placeholder="" />
      </View>
      <View style={profileStyle.fieldContainer}>
        <Text style={profileStyle.textField}>Ngày tháng năm sinh</Text>
        <TextInput style={profileStyle.inputField} placeholder="" />
      </View>
    </View>
  );
};

export default EditField;
