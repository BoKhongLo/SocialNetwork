import React, { useState, useEffect } from 'react';
import { View, ScrollView, Animated, SafeAreaView, RefreshControl } from 'react-native';
import Header from '../components/componentsHome/Header';
import Stories from '../components/componentsHome/Stories';
import BottomTabs from '../components/componentsHome/BottomTabs';
import Post from '../components/componentsHome/Post';

const HomeScreen = () => {
  const [scrollY] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);

  const headerOpacity = Animated.diffClamp(scrollY, 0, 45).interpolate({
    inputRange: [0, 45],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerTranslateY = Animated.diffClamp(scrollY, 0, 45).interpolate({
    inputRange: [0, 45],
    outputRange: [0, -45],
    extrapolate: 'clamp',
  });

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      // Reset the scrollY value and reset refreshing state
      scrollY.setValue(0);
      setRefreshing(false);
    }, 1000); // Adjust the delay as needed
  };

  return (
    // <View style={{ flex: 1 }}>
    //   <SafeAreaView>
    //     <Animated.View
    //       style={{
    //         transform: [{ translateY: headerTranslateY }],
    //         opacity: headerOpacity,
    //         zIndex: 100,
    //       }}
    //     >
    //       <Header />
    //     </Animated.View>
    //   </SafeAreaView>
    //   <ScrollView
    //     style={{ flex: 1 }}
    //     scrollEventThrottle={16}
    //     onScroll={Animated.event(
    //       [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    //       { useNativeDriver: false }
    //     )}
    //     refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    //   >
    //     <Stories />
    //     <Post />
    //   </ScrollView>
    //   <BottomTabs />
    // </View>
    <SafeAreaView style ={{flex:1}}>
      <Header/>
      <ScrollView>
        <Stories/>
        <Post/>
      </ScrollView>
      <BottomTabs/>
    </SafeAreaView>
  );
};

export default HomeScreen;
