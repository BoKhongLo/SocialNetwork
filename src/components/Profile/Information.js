import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";
import profileStyle from "../../styles/profileStyles";
import { length } from "./../../../node_modules/svgo/node_modules/css-tree/lib/lexer/units";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Information = ({ data }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        width: wp("100%"),
        height: hp("20%"),
      }}
    >
      <View
        style={{
          width: wp("40%"),
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Image style={profileStyle.avatar} source={data.avt} />
        <Text>{data.username}</Text>
        <View style={profileStyle.bietdanhContainer}>
          <Text>{data.nickName}</Text>
        </View>
      </View>
      <View style={{ width: wp("60%") }}>
        <View style={{ flex: 0.5, flexDirection: "row" }}>
          <View style={profileStyle.numInfor}>
            <Text style={{fontWeight:'500', fontSize:25}}>{data.friends.length} </Text>
            <Text style={{fontWeight:'500'}}> Friends </Text>
          </View>
          <View style={profileStyle.numInfor}>
            <Text style={{fontWeight:'500', fontSize:25}}>{data.posted} </Text>
            <Text style={{fontWeight:'500'}}> Post </Text>
          </View>
        </View>
        <View style={profileStyle.tell}>
          <Text>{data.description}</Text>
        </View>
      </View>
    </View>
  );
};

export default Information;