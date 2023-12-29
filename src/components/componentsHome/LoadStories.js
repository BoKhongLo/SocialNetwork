// Trong component LoadStories.js
import React from "react";
import { View, Text, Image, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const LoadStories = ({ route }) => {
  const insets = useSafeAreaInsets();
  const { imagepost } = route.params; // Nhận dữ liệu avt từ navigation props

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        justifyContent: "space-between",
        // alignItems: "center",
        flex: 1,
      }}
    >
      {/* <Image style={{ width: wp("100%"), height: hp("90%"),borderRadius:15 }} source={avt} /> */}
      <Image
        style={{ flex: 0.9, borderRadius: 15, alignItems: "center" }}
        source={imagepost}
      />
      <Comments />
    </View>
  );
};

const Comments = () => {
  return (
    <View style={{ flex: 0.1 }}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          {/* TextInput chiếm 7 phần */}
          <View style={{ flex: 7, marginLeft:10 }}>
            <TextInput
              placeholder="Gửi tin nhắn"
              style={{ borderRadius: 20, borderWidth: 1, height: hp('5%'), textAlign: 'center',}}
            />
          </View>

          {/* View chứa hai thành phần Text, chiếm 3 phần */}
          <View style={{ flex: 3, flexDirection: 'row', justifyContent: 'space-around' }}>
            <Text>Tim</Text>
            <Text>Share</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoadStories;