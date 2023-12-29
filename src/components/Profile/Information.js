import { View, Text, Image } from "react-native";
import React, {useEffect} from "react";
import profileStyle from "../../styles/profileStyles";

const Information = ({data}) => {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={{ flex: 0.4, justifyContent: "flex-start" }}>
        <Image style={profileStyle.avatar} />
        <View>
          <Text>{data.username}</Text>
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
            <Text style={{marginHorizontal: 10, paddingLeft: 20}}>{data.nickName}</Text>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 0.7,
        }}
      >
        <View style={{ justifyContent: "center", alignItems: "center", marginVertical: 20 }}>
          <Text
            style={{ fontWeight: "500", fontSize: 20 }}
          >
            1
          </Text>
          <Text style={{ fontWeight: "500", fontSize: 20}}>Đăng</Text>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{ fontWeight: "500", fontSize: 20}}
          >{data.friends.length}</Text>
          <Text style={{ fontWeight: "500", fontSize: 20 }}>
            Bạn bè
          </Text>
        </View>
        {/* <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text>1</Text>
          <Text style={{ fontWeight: "300", fontSize: 10 }}>Đang theo dõi</Text>
        </View> */}
      </View>
    </View>
  );
};

export default Information