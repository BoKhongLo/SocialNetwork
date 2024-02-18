import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome from "react-native-vector-icons/FontAwesome";


const ContactUs = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const receivedData = route.params?.data;

  const openEmail = () => {
    Linking.openURL('mailto:blackcatstudio2024@gmail.com')
  };

  const openWebsite = () => {
    Linking.openURL('http://103.155.161.116/contact');
  };
  
  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <FontAwesome
          name="chevron-left"
          size={30}
          color="#333"
          onPress={() => navigation.replace('setting')}
          style={{ padding: 10 }}
        />
        <Text style={{ fontSize: 18 }}>Contact Us</Text>
      </View>
      <View style={{ marginVertical: 10, alignItems: "center",  justifyContent: "center"}}>
         {/* Gmail Icon */}
         <TouchableOpacity 
            style={{alignItems: "center", marginBottom: 50, marginTop: 100 }}
            onPress={openEmail}
         >
          <Image
            source={require("../../../assets/img/emailLogo.png")}
            style={{ width: 120, height: 120}}
          />
            <Text
                style={{fontSize: 25, fontWeight: "bold"}}
            >
                Email
            </Text>
        </TouchableOpacity>

        {/* Web Icon */}
        <TouchableOpacity 
            style={{alignItems: "center",}}
            onPress={openWebsite}
        >
          <Image
            source={{uri: 'https://firebasestorage.googleapis.com/v0/b/testgame-d8af2.appspot.com/o/icon.png?alt=media&token=f5c02dfa-e3ca-43eb-8330-fb56439f9c8b'}}
            style={{ width: 120, height: 120 }}
          />
            <Text
                style={{fontSize: 25, fontWeight: "bold"}}
            >
                Web
            </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ContactUs;
