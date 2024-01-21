import React from "react";
import { View, Text, Image, FlatList, TouchableHighlight } from "react-native";
import styles from "../../styles/styles";
import highLight from "../../styles/highLightStyles";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const Stories = ({ post, users }) => {
  const navigation = useNavigation();

  const handleStoryPress = (item) => {
    navigation.navigate("loadStory", { data: { post: item, users: users}});
  };
  
  const renderItem = ({ item }) => (
    <View style={{ alignItems: "center", marginHorizontal: 5 }}>
      <LinearGradient
        colors={['#CA1D7E', '#E35157', '#F2703F']}
        start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
        style={{ height: 82,width: 82,alignItems: 'center',justifyContent: 'center',borderRadius:82 / 2}}
      >
        <TouchableHighlight
          style={[highLight.highLightStories, {
            width: 75,height: 75,borderRadius: 75/2,alignSelf: 'center',borderColor: '#fff',borderWidth: 3
          }]}
          onPress={() => handleStoryPress(item)}
        >
          { users[item.ownerUserId].detail.avatarUrl ? (
          <Image style={styles.storyImg} source={{uri : users[item.ownerUserId].detail.avatarUrl}} />
          ) : (
            <Image style={styles.storyImg}  />
          )}
        </TouchableHighlight>
      </LinearGradient>
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