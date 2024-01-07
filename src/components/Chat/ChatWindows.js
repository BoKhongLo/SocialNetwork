import { View, Text } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ChatWindows = ({ user }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        flex: 1,
      }}
    >
      <Header />
      <Content />
      <Label/>
    </View>
  );
};

const Header = ({ user }) => {
  return (
    <View style={{ flex: 0.1, backgroundColor: "black" }}>
      <Text>header</Text>
    </View>
  );
};

const Content = () => {
  return (
    <View style={{ flex:0.9}}>
      <Text>content</Text>
    </View>
  );
};

const Label = () => {
  return (
    <View style={{ flex: 0.1, backgroundColor: "black",borderRadius: 20 }}>
      <Text>khung chat</Text>
    </View>
  );
};
export default ChatWindows;
