import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import newGroup from "../../../styles/ChatStyles/newGroupStyles";

const Item = ({ user, onAdd, onRemove }) => {
  const [isAdd, setIsAdd] = useState("Add");

  const handleUpdate = (id) => {
    if (isAdd === "Add") {
      onAdd(id);
      setIsAdd("Added");
    } else if (isAdd === "Added") {
      onRemove(id);
      setIsAdd("Add");
    }
  };

  return (
    <View style={{ marginVertical: 10, flexDirection: "row", alignItems:'center' }}>
      {user.detail.avatarUrl ? (
        <Image
          style={newGroup.itemAvt}
          source={{ uri: user.detail.avatarUrl }}
        />
      ) : (
        <Image style={newGroup.itemAvt} />
      )}
      <View style={{ flex: 1, marginHorizontal: 10 }}>
        <Text style={newGroup.text}>{user.detail.name}</Text>

      </View>
      <TouchableOpacity
        style={newGroup.addButton}
        onPress={() => handleUpdate(user.id)}
      >
        <Text style={newGroup.text}>{isAdd}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Item;