import React from "react";
import { View, Text, Image, FlatList, TouchableHighlight } from "react-native";
import styles from "../../styles/styles";
import highLight from "../../styles/highLightStyles";
import { useNavigation } from '@react-navigation/native';

const Stories = ({ post }) => {
  const navigation = useNavigation();

  const { username, avt, imagepost } = post[0];

  const handleStoryPress = () => {
    // Chuyển hướng đến màn hình LoadStories và truyền dữ liệu avt
    navigation.navigate("loadStory", { imagepost });
  };
  const renderItem = ({ item }) => (
    <View style={{ alignItems: "center", marginHorizontal: 5 }}>
      <TouchableHighlight
        style={highLight.highLightStories}
        onPress={handleStoryPress}
      >
        <Image style={styles.stroyImg} source={item.avt} />
      </TouchableHighlight>
      <Text style={{ color: "black" }}>{item.username}</Text>
    </View>
  );

  return (
    <View>
      <FlatList
        data={post}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          marginBottom: 10,
          justifyContent: "center",
          marginTop: 5,
        }}
      />
    </View>
  );
};

export default Stories;
