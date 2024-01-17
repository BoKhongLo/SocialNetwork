import React from "react";
import { View, Text, Image, FlatList, TouchableHighlight } from "react-native";
import styles from "../../styles/styles";
import highLight from "../../styles/highLightStyles";
import { useNavigation } from '@react-navigation/native';

const Stories = ({ post, users }) => {
  const navigation = useNavigation();

  const handleStoryPress = (item) => {
    navigation.navigate("loadStory", { data: { post: item, users: users}});
  };
  
  const renderItem = ({ item }) => (
    <View style={{ alignItems: "center", marginHorizontal: 5 }}>
      <TouchableHighlight
        style={highLight.highLightStories}
        onPress={() => handleStoryPress(item)}
      >
        { users[item.ownerUserId].detail.avatarUrl ? (
        <Image style={styles.stroyImg} source={{uri : users[item.ownerUserId].detail.avatarUrl}} />
        ) : (
          <Image style={styles.stroyImg}  />
        )}

      </TouchableHighlight>
      <Text style={{ color: "black" }}>{users[item.ownerUserId].detail.name}</Text>
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