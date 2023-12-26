import { View, Text, Image } from "react-native";
import React from "react";
import profileStyle from "../../styles/profileStyles";

const Information = () => {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={{ flex: 0.4, justifyContent: "flex-start" }}>
        <Image style={profileStyle.avatar} />
        <View>
          <Text>Ngô Cung Đức Anh</Text>
          <View
            style={{
              backgroundColor: "grey",
              padding: 3,
              borderRadius: 20,
              alignSelf: "flex-start",
              paddingVertical: 5,
              marginTop: 5
            }}
          >
            <Text style={{marginHorizontal: 10}}>biệt danh</Text>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 0.6,
        }}
      >
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text>1</Text>
          <Text style={{ fontWeight: "500" }}>Đăng</Text>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text>1</Text>
          <Text style={{ fontWeight: "300", fontSize: 10 }}>
            Người theo dõi
          </Text>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text>1</Text>
          <Text style={{ fontWeight: "300", fontSize: 10 }}>Đang theo dõi</Text>
        </View>
      </View>
    </View>
  );
};

export default Information