import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import React, { useEffect, useState } from "react";
import cpnNotiStyles from "../../styles/NotiStyle/notiStyles";
import {
    getAllIdUserLocal,
    getDataUserLocal,
    updateAccessTokenAsync,
    getUserDataAsync,
    removeFriendAsync,
} from "../../util"
import { useNavigation } from "@react-navigation/native";

const ItemFriends = ({ userId }) => {
    const [dataFriends, setDataFriends] = useState([])
    const [dataUser, setDataUser] = useState({})

    const handleRemoveFriends = (id) => {
        setDataFriends(item => item.filter(friendId => friendId !== id))
    }

    useEffect(() => {
        const fetchData = async () => {
            const keys = await getAllIdUserLocal();
            const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
            let dataUserLocal = { ...dataLocal }
            let dataRequest = await getUserDataAsync(
                userId,
                dataUserLocal.accessToken
            );
            if ("errors" in dataRequest) {
                const dataUpdate = await updateAccessTokenAsync(
                    dataUserLocal.id,
                    dataUserLocal.refreshToken
                );
                dataUserLocal.accessToken = dataUpdate.accessToken;
                dataRequest = await getUserDataAsync(
                    userId,
                    dataUserLocal.accessToken
                );
            }

            if ("errors" in dataRequest) return;
            const tmpDataUser = {};
            dataRequest.friends = [...new Set(dataRequest.friends)]
            for (let i = 0; i < dataRequest.friends.length; i++) {
                if (dataRequest.friends[i] in tmpDataUser) continue;
                let tmpData = await getUserDataAsync(dataRequest.friends[i], dataUserLocal.accessToken);
                tmpDataUser[tmpData.id] = tmpData;
            }
            setDataUser(tmpDataUser)
            setDataFriends(dataRequest.friends)
            console.log(dataRequest)
        }
        fetchData()
    }, [])
    return (
        <View style={cpnNotiStyles.container}>
            <FlatList
                data={dataFriends}
                keyExtractor={(item) => item}
                renderItem={({ item }) => <Item data={item} users={dataUser} removeRq={handleRemoveFriends} />}
            />
        </View>
    );
};

const Item = ({ data, users, removeRq }) => {
    const navigation = useNavigation();
    const handleDeny = async (friendId) => {
        const keys = await getAllIdUserLocal();
        const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
        const dataUpdate = await updateAccessTokenAsync(
            dataUserLocal.id,
            dataUserLocal.refreshToken
        );
        await removeFriendAsync(dataUserLocal.id, friendId, dataUpdate.accessToken)
        removeRq(friendId)
    }

    const handleUserPress = async (userId) => {
        const keys = await getAllIdUserLocal();
        const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
        const receivedData = { ...dataUserLocal };
        receivedData.id = userId;
        navigation.replace("Profile", { data: receivedData });
    };

    return (
        <TouchableOpacity style={cpnNotiStyles.itemContainer}
            onPress={() => handleUserPress(data)}
        >

            <View style={{ flex: 1, marginRight: 5 }}>
                {users[data].detail.avatarUrl ? (
                    <Image style={cpnNotiStyles.avt} source={{ uri: users[data].detail.avatarUrl }} />
                ) : (
                    <Image style={cpnNotiStyles.avt} />
                )}

            </View>
            <View
                style={{
                    justifyContent: "center",
                    flex: 2,
                    marginRight: 5,
                }}
            >
                <Text style={cpnNotiStyles.name}>{users[data].detail.name}</Text>
                {users[data].detail.nickname && (
                    <Text style={cpnNotiStyles.nickname}>{users[data].detail.nickname}</Text>
                )}

            </View>
            <View style={{ flex: 1, marginLeft: 5, flexDirection: "row", }}>
                <TouchableOpacity style={cpnNotiStyles.button}
                    onPress={async () => await handleDeny(data)}
                >
                    <Text style={cpnNotiStyles.buttonText}>Remove</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

export default ItemFriends;
