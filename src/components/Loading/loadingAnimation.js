import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

const loadingAnimation = () => {
  return (
    <View>
      <LottieView
        style={[
          StyleSheet.absoluteFillObject,
          {
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.3",
            zIndex: 1,
          },
        ]}
        source={require("../../assets/animation/Animation-Quaytron.json")}
        autoPlay
        loop
      />
    </View>
  );
};

export default loadingAnimation;

const styles = StyleSheet.create({});
