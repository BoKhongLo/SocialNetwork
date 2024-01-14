import { View, Text, } from "react-native";
import React, { useState } from "react";
import profileStyle from "../../styles/profileStyles";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

const Options = () => {
  const navigation = useNavigation();
  const [isFriendAdded, setFriendAdded] = useState(false);

  const handleAddFriendPress = () => {
    setFriendAdded(!isFriendAdded);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        marginVertical: 10,

        paddingBottom: 15,
        justifyContent: "center",
      }}
    >
      <TouchableOpacity
        style={[
          profileStyle.editContainer,
          isFriendAdded ? { backgroundColor: "#1E90FF" } : null,
          { marginHorizontal: 12 },
        ]}
        onPress={handleAddFriendPress}
      >
        <Text style={profileStyle.textEdit}>
          {isFriendAdded ? "   Added     " : "Add Friend"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[profileStyle.editContainer, { paddingHorizontal: 18 }]}
      >
        <Text style={profileStyle.textEdit}>Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Options;