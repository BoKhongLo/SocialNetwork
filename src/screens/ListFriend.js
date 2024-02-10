import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Divider } from "react-native-elements";
import notistyles from "../styles/notiStyles";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "../styles/styles";
import ItemFriends from "../components/Friends/ItemFriend";
import {
    getAllIdUserLocal,
    getDataUserLocal,
  } from "../util";

const ListFriend = () => {
    const insets = useSafeAreaInsets();
    const route = useRoute();
    const navigation = useNavigation();
    const receivedData = route.params?.data
    useEffect(() => {
        if (!receivedData) {
            navigation.navigate("main")
        }
        console.log(receivedData);
    }, [])

    return (
        <View
            style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left + 10,
                paddingRight: insets.right + 10,
                flex: 1,
            }}
        >

            <Header userId={receivedData.userId}/>
            <Divider width={1} orientation="vertical" />
            {receivedData && (
                <ItemFriends userId={receivedData.userId} />
            )}

        </View>
    );
};

const Header = ({userId}) => {
    const navigation = useNavigation();
    const handleReBack = async () => {
        const keys = await getAllIdUserLocal();
        const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
        let dataReBack = {...dataLocal}
        dataReBack.id = userId;
        navigation.replace("Profile", {data: dataReBack});
    }
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                marginBottom: 10,
            }}
        >
            <TouchableOpacity onPress={handleReBack}>
                <Image
                    style={[styles.iconforAll]}
                    source={require("../../assets/dummyicon/left_line_64.png")}
                />
            </TouchableOpacity>
            <Text style={notistyles.headerName}>Friends</Text>
        </View>
    );
};

export default ListFriend;
