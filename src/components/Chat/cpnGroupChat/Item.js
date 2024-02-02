import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import newGroup from "../../../styles/ChatStyles/newGroupStyles";

const Item = ({ user, onAdd, onRemove, typeItem, isMod }) => {
  const [isAdd, setIsAdd] = useState("Add");

  const handleUpdate = (id, event) => {
    if (typeItem === "ADDMEMBER") {
      if (event === "Add") {
        onAdd(id)
        setIsAdd("Added");
      }
      else if (event === "Added") {
        onRemove(id)
        setIsAdd("Add");
      }
    }
    else if (typeItem === "VIEWMEMBER") {
      if (event === "Remove") {
        onRemove(id, "Remove");
      }
      else if (event === "Add Mod") {
        onAdd(id, "Add Mod");
      }
      else if (event === "Remove Mod") {
        onRemove(id, "Remove Mod");
      }
    }


  }

  return (
    <View style={{ marginVertical: 10, flexDirection: "row", alignItems: 'center' }}>
      {user && user.detail.avatarUrl ? (
        <Image
          style={newGroup.itemAvt}
          source={{ uri: user.detail.avatarUrl }}
        />
      ) : (
        <Image style={newGroup.itemAvt} source={require("../../../../assets/img/avt.png")} />
      )}
      <View style={{ flex: 1, marginHorizontal: 10 }}>
        <Text style={newGroup.text}>{user && (user.detail.name)}</Text>
      </View>
      {typeItem == "ADDMEMBER" ? (
        <TouchableOpacity
          style={newGroup.addButton}
          onPress={() => handleUpdate(user.id, isAdd)}
        >
          <Text style={newGroup.text}>{isAdd}</Text>
        </TouchableOpacity>
      ) : typeItem == "VIEWMEMBER" && isMod !== "Admin" && isMod !== "isUser" && (
        <View>

          <TouchableOpacity
            style={newGroup.addButton}
            onPress={() => handleUpdate(user.id, "Remove")}
          >
            <Text style={newGroup.text}>Remove</Text>
          </TouchableOpacity>
          {isMod !== "Mod" && (
            <TouchableOpacity
              style={newGroup.addButton}
              onPress={() => handleUpdate(user.id, isMod)}
            >
              <Text style={newGroup.text}>{isMod}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

    </View>
  );
};

export default Item;