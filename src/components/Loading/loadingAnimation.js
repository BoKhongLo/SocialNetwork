import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const LoadingAnimation = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.overlay, { flex: 1 }]}>
      <LottieView
        style={[{height:150,width:150,alignItems:'center',}]}
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
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.2)',
  },
});

export default LoadingAnimation;