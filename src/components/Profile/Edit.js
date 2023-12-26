import { View, Text } from "react-native";
import React from "react";
import profileStyle from "../../styles/profileStyles";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

const Edit = () => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 30,
        marginBottom: 30,
      }}
    >
      <View style={profileStyle.editContainer}>
        <TouchableOpacity onPress={()=> navigation.navigate('editfield')}>
          <Text style={profileStyle.textEdit}>Chỉnh sửa</Text>
        </TouchableOpacity>
      </View>
      <View style={profileStyle.editContainer}>
        <TouchableOpacity>
          <Text style={profileStyle.textEdit}>Chia sẻ trang cá nhân</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Edit;