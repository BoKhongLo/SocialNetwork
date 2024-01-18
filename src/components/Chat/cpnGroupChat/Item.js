import { View, Text, Image,TouchableOpacity } from "react-native";
import React from "react";
import newGroup from "../../../styles/ChatStyles/newGroupStyles";

const Item = () => {
  return (
    <View style={newGroup.itemContainer}>
      <Image style={newGroup.itemAvt} />
      <View style={{ flex: 1, marginHorizontal:10}}>
        <Text style={newGroup.text}>name</Text>
      </View>
      <TouchableOpacity style={newGroup.addButton}>
        <Text style={newGroup.text}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Item;