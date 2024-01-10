import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { GiftedChat } from "react-native-gifted-chat";
import { useNavigation } from "@react-navigation/native";
import { Divider } from "react-native-elements";

const ChatWindows = ({ user }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left+10,
        paddingRight: insets.right+10,
        flex: 1,
        backgroundColor: "#FFFFFF"
      }}
    >
      <Header />
      <Divider width={1} orientation="vertical" />
      <Content />
      <View>
        <Text></Text>
      </View>
    </View>
  );
};
//justificontent:'space-between'
const Header = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: "row",
        height: heightPercentageToDP("8%"),
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("chat")}
        style={{ padding: 10 }}
      >
        <Image
          style={{ height: 40, width: 40 }}
          source={require("../../../assets/dummyicon/left_line_64.png")}
        />
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: "500" }}>ten nguoi nhan</Text>
      <TouchableOpacity style={{ padding: 10 }}>
        <Image
          style={{ height: 30, width: 30 }}
          source={require("../../../assets/dummyicon/menu.png")}
        />
      </TouchableOpacity>
    </View>
  );
};

const Content = () => {
  const [messages, setMessages] = useState([]); // Initialize as an array
  const [inputText, setInputText] = useState("");

  const onSend = () => {
    if (inputText.trim() === "") {
      return;
    }

    // Gửi tin nhắn và đặt lại giá trị của TextInput
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, {
        _id: Math.round(Math.random() * 1000000),
        text: inputText.trim(),
        createdAt: new Date(),
        user: { _id: 1 },
      })
    );
    setInputText(""); // Đặt lại giá trị của TextInput thành rỗng
  };

  const renderMessage = (props) => {
    const { currentMessage } = props;
    if (currentMessage && currentMessage._id) {
      return (
        <View style={styles.customMessageContainer}>
          <Text style={styles.customMessageText}>{currentMessage.text}</Text>
        </View>
      );
    }

    return null;
  };

  // Render input toolbar
  const renderInputToolbar = (props) => {
    return (
      <View style={styles.customInputContainer}>
        <TextInput
          style={styles.customInput}
          placeholder="Type a message..."
          placeholderTextColor="#555"
          onChangeText={(text) => setInputText(text)} // Cập nhật giá trị của inputText
          value={inputText} // Gán giá trị của inputText vào TextInput
          {...props}
        />
        <TouchableOpacity onPress={onSend}>
          <Image
            style={{ height: 30, width: 30 }}
            source={require("../../../assets/dummyicon/share.png")}
          />
        </TouchableOpacity>
      </View>
    );
  };

  // Render send button
  const renderSend = (props) => {
    return (
      <Send {...props} onPress={onSend}>
        <View>
          <Text
            style={{ color: "#007BFF", fontWeight: "bold", marginRight: 8 }}
          >
            Send
          </Text>
        </View>
      </Send>
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{ _id: 1 }}
      renderMessage={renderMessage}
      renderInputToolbar={renderInputToolbar}
      renderSend={renderSend}
    />
  );
};

const styles = StyleSheet.create({
  customMessageContainer: {
    backgroundColor: "#f1f1f1",
    margin: 10,
    alignSelf:'flex-end',
    borderRadius:15

  },
  customMessageText: {
    fontSize: 22,
    margin:3,
    padding: 10,

  },
  customInputContainer: {
    backgroundColor: "#ecf0f1",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 50,
  },
  customInput: {
    color:"#000000",
    flex: 1,
    fontSize: 16,
    padding: 15,
  },
});
export default ChatWindows;
