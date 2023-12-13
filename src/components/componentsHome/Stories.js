import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import styles from '../../styles/styles';

const Stories = ({post,onPressStories}) => {

    const { username, avt } = post[0]; // data test

    const handlePressStories = () =>{
        console.log("stories pressed!")
        if (onPressStories){
            onPressStories();
        }
    }
    const renderItem = ({post}) => (
        <View style={{ alignItems: 'center', marginHorizontal: 5 }}>
            <TouchableOpacity onPress={handlePressStories }>
                <Image
                style={styles.stroryImg}
                source={avt}
                />
            </TouchableOpacity>
            <Text style={{ color: 'black' }}>{username}</Text>
        </View>
        );

    return (
        <View>
            <FlatList
                data={post}
                renderItem={renderItem}
                keyExtractor={(item) => item.key}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ marginBottom: 10, justifyContent: 'center', marginTop: 5 }}
            />
        </View>
    );
    };

    export default Stories;