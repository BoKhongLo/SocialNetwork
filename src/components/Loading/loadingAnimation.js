import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const LoadingAnimation = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <View style={[StyleSheet.absoluteFill, styles.overlay,{flex:1}]}>
      <LottieView
        style={StyleSheet.absoluteFill}
        source={require("../../../assets/animation/Animation_Conmeo.json")}
        autoPlay
        loop
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    zIndex: 1,
  },
});

export default LoadingAnimation;