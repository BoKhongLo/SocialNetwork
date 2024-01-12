// Trong component LoadStories.js
import React, { useState,useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import styles from "../../styles/styles";
import { useNavigation } from "@react-navigation/native";

const LoadStories = ({ route }) => {
  const [imageHeight, setImageHeight] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  useEffect(() => {
    // Check if the URI is valid and not empty
    if (imagepost && imagepost.uri) {
      // Get the dimensions of the image
      Image.getSize(
        imagepost.uri,
        (width, height) => {
          // Set the height dynamically
          setImageHeight(height);
          setImageWidth(width)
        },
        (error) => {
          console.error('Error getting image dimensions:', error);
        }
      );
    }
  }, [imagepost]);

  const navigation = useNavigation();
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
        flex: 1,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("main")}
          style={{ marginLeft: 10 }}
        >
          <Image
            style={styles.iconforAll}
            source={require("../../../assets/dummyicon/left_line_64.png")}
          />
        </TouchableOpacity>
      </View>
      <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: 'auto',
        marginBottom: 50,
        marginTop: 50,
        flex:1
      }}
    >
      <Image
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'contain',
          alignItems: 'center',
        }}
        source={imagepost}
      />
    </View>


      <Comments />
    </View>
  );
};

const Comments = () => {
  const [text, setText] = useState("");

  const handleInputChange = (inputText) => {
    setText(inputText);
  };
  const handleSend = () => {
    setText("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ flex: 0.1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ flex: 1, justifyContent: "center" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 8, marginLeft: 10 }}>
            <TextInput
              keyboardType="default"
              placeholder="Gửi tin nhắn"
              style={{
                borderRadius: 20,
                borderWidth: 1,
                height: hp("5%"),
                textAlign: "center",
              }}
              onChangeText={handleInputChange}
              value={text}
            />
          </View>
          <View
            style={{
              flex: 3,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity onPress={handleSend}>
              <Image
                style={styles.iconforAll}
                source={require("../../../assets/dummyicon/share.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
export default LoadStories;
