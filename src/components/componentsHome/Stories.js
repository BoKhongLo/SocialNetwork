import React from 'react';
import { View, Text, Image, FlatList, TouchableHighlight } from 'react-native';
import styles from '../../styles/styles';
import highLight from '../../styles/highLightStyles';
const Stories = ({ post, onPressStories }) => {

    const { username, avt } = post[0]; // data test

    const handlePressStories = () => {
        console.log("stories pressed!")
        if (onPressStories) {
            onPressStories();
        }
    }
    const renderItem = ({ item }) => (
        <View style={{ alignItems: 'center', marginHorizontal: 5 }}>
            <TouchableHighlight
                style={highLight.highLightStories}
                onPress={handlePressStories}>
                <Image
                    style={styles.stroyImg}
                    source={item.avt}
                />
            </TouchableHighlight>
            <Text style={{ color: 'black' }}>{item.username}</Text>
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
                contentContainerStyle={{ marginBottom: 10, justifyContent: 'center', marginTop: 5 }}
            />
        </View>
    );
};

export default Stories;