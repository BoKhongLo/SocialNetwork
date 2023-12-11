import React from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import styles from '../../styles/styles';

const Stories = () => {
    const data = [
        { key: '1', name: 'asdsad' },
        { key: '2', name: 'asdsadsa' },
        { key: '3', name: 'asdasddasasd' },
        { key: '4', name: 'dsdasdsaaa' },
        { key: '5', name: 'asaasdass' },
        { key: '6', name: 'asasdsadsa' },
        { key: '7', name: 'asdsadas' },
        ];

    const renderItem = ({ item }) => (
        <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
            <Image
            style={styles.stroryImg}
            source={require('../../../assets/img/dummyImg.png')}
            />
            <Text style={{ color: 'black' }}>{item.name}</Text>
        </View>
        );

    return (
        <View>
            <FlatList
                data={data}
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