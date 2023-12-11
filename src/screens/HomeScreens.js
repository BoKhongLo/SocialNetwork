import React, { useState, useEffect } from 'react';
import { View, ScrollView, Animated, SafeAreaView, RefreshControl } from 'react-native';
import Header from '../components/componentsHome/Header';
import Stories from '../components/componentsHome/Stories';
import BottomTabs from '../components/componentsHome/BottomTabs';
import Post from '../components/componentsHome/Post';

const HomeScreen = () => {
  const [scrollY] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);
  const handledif = Animated.diffClamp(scrollY, 0, 45)
  const headerOpacity = handledif.interpolate({
    inputRange: [0, 100], // You can adjust the range based on your design
    outputRange: [0, -100],
    // extrapolate: 'clamp',
  });

  const handleRefresh = () => {
    setRefreshing(true);
    // Perform your refresh logic, e.g., fetching new data
    // ...

    // Simulate an asynchronous operation (e.g., API call) with setTimeout
    setTimeout(() => {
      // Update the Animated.Value and reset refreshing state
      scrollY.setValue(0);
      setRefreshing(false);
    }, 1000); // Adjust the delay as needed
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.View style={{
        transform:[
          {translateY: headerOpacity }
        ],
        elevation:4,
        zIndex:100,
      }}>
        <Header />
      </Animated.View>
      <ScrollView
        style={{ flex: 1 }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        <Stories />
        <Post />
      </ScrollView>
      <BottomTabs />
    </SafeAreaView>
  );
};

export default HomeScreen;
