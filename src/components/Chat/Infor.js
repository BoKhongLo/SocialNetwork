import {
  View,
  Text,
  Image,
  TouchableOpacity,
  BackgroundImage,
} from "react-native";
import React from "react";
import settingChat from "../../styles/ChatStyles/settingStyle";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const Infor = ({ receivedData }) => {
  return (
    <View style={settingChat.avtContainer}>
      {receivedData && receivedData.imgDisplay ? (
        <Image style={settingChat.avt} source={receivedData.imgDisplay} />
      ) : receivedData && receivedData.isSingle == true ? (
        <Image
          style={settingChat.avt}
          source={require("../../../assets/img/avt.png")}
        />
      ) : (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            marginBottom: 10,
          }}
        >
          <Image
            style={[settingChat.avt]}
            source={require("../../../assets/img/avt.png")}
          />
          <FontAwesome
            name="edit"
            size={20}
            color="black"
            style={{ textAlignVertical: "bottom" }}
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          marginBottom: 20,
        }}
      >
        <Text style={settingChat.name}>{receivedData.title}</Text>
        <FontAwesome
          name="edit"
          size={15}
          color="black"
          style={{ textAlignVertical: "bottom" }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Infor;
