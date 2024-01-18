import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import cpnNotiStyles from "../../styles/NotiStyle/notiStyles";

const Invite = () => {
  return (
    <View style={cpnNotiStyles.container}>
      <Text style={cpnNotiStyles.title}>Friend invite</Text>
      <Item />
    </View>
  );
};

const Item = () => {
  return (
      <TouchableOpacity style={cpnNotiStyles.itemContainer}>
        <View style={{ flex: 1, marginRight: 5 }}>
          <Image style={cpnNotiStyles.avt} />
        </View>
        <View
          style={{
            justifyContent: "center",
            flex: 2,
            marginRight: 5,
          }}
        >
          <Text style={cpnNotiStyles.name}>name</Text>
          <Text style={cpnNotiStyles.nickname}>nickname</Text>
        </View>
        <View style={{ flex: 2, marginLeft: 5, flexDirection: "row" }}>
          <TouchableOpacity style={cpnNotiStyles.button}>
            <Text style={cpnNotiStyles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={cpnNotiStyles.button}>
            <Text style={cpnNotiStyles.buttonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
  );
};

export default Invite;
