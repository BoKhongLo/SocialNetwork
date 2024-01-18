import React, { useState } from "react";
import { View, TextInput, FlatList, Button, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UserItem from "../components/Search/UserItem";
import { Divider } from "react-native-elements";
import BottomTabs from "../components/Home/BottomTabs";
import Search from "./../components/Chat/Search";
import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  getUserDataAsync,
  getAllIdUserLocal,
  getDataUserLocal,
  updateAccessTokenAsync,
  findFriendAsync,
} from "../util";
import { useNavigation } from "@react-navigation/native";
import searchStyles from "../styles/searchScreen";

const SearchScreen = () => {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState("");
  const [dataSearch, setDataSearch] = useState([]);
  const navigation = useNavigation();

  const handleUserPress = async (user) => {
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    const receivedData = { ...dataUserLocal };
    receivedData.id = user.id;
    navigation.navigate("Profile", { data: receivedData });
  };

  const handleSearch = async (content) => {
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    const dataRequest = await findFriendAsync(
      searchText,
      dataUserLocal.accessToken
    );
    if ("errors" in dataRequest) {
      const dataUpdate = await updateAccessTokenAsync(
        dataUserLocal.id,
        dataUserLocal.refreshToken
      );
      dataRequest = await findFriendAsync(content, dataUpdate.accessToken);
    }

    setDataSearch(dataRequest);
  };
  const renderItem = ({ item }) => (
    <UserItem user={item} onPress={handleUserPress} />
  );

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        flex: 1,
      }}
    >
      <View style={{ flex: 1, padding: 16 }}>
        <View
          style={searchStyles.container}
        >
          <TextInput
            style={searchStyles.textInput}
            placeholder="Search"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
          <TouchableOpacity
            style={searchStyles.button}
            onPress={async () => await handleSearch(searchText)}
          >
            <Text>
              <MaterialCommunityIcons
                name="magnify"
                size={32}
                color="black"
              />
            </Text>
          </TouchableOpacity>
        </View>

        {dataSearch.length > 0 && (
          <FlatList
            data={dataSearch}
            keyExtractor={(user) => user.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
      <BottomTabs />
    </View>
  );
};

export default SearchScreen;
