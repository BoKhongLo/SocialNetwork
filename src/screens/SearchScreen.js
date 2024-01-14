import React, { useState } from "react";
import { View, TextInput, FlatList, Button, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UserItem from "../components/Search/UserItem";
import { Divider } from "react-native-elements";
import BottomTabs from "../components/Home/BottomTabs";
import Search from './../components/Chat/Search';

const SearchScreen = () => {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [users, setUsers] = useState([
    { id: "1", username: "Tuan Anh 1", nickname: "user1@example.com" },
    { id: "2", username: "Duc Anh 2", nickname: "user2@example.com" },
    { id: "3", username: "Lan Anh 3", nickname: "user3@example.com" },
    { id: "4", username: "Lan Anh 4", nickname: "user3@example.com" },
    { id: "5", username: "Lan Anh 5", nickname: "user3@example.com" },
    { id: "6", username: "Lan Anh 6", nickname: "user3@example.com" },
    { id: "7", username: "Lan Anh 7", nickname: "user3@example.com" },
    { id: "8", username: "Lan Anh 8", nickname: "user3@example.com" },
    { id: "9", username: "Lan Anh 9", nickname: "user3@example.com" },
    { id: "10", username: "Lan Anh 10", nickname: "user3@example.com" },
    { id: "11", username: "Lan Anh 11", nickname: "user3@example.com" },
    { id: "12", username: "Lan Anh 12", nickname: "user3@example.com" },
  ]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const handleSearch = (text) => {
    const filteredUsers = users.filter(
      (user) =>
        user.username.toLowerCase().includes(text.toLowerCase()) ||
        user.nickName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filteredUsers);
    setSearchText(text);
    setShowResults(text.length > 0);
  };

  const handleUserPress = (user) => {
    // Xử lý sự kiện khi một người dùng được chạm
    console.log(`User ${user.username} pressed`);
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
        <TextInput
          style={{
            height: 50,
            marginBottom: 10,
            padding: 10,
            fontSize: 18, 
            borderRadius: 40,
            paddingLeft:20, 
            backgroundColor:'lightgray'
          }}
          placeholder="Search"
          value={searchText}
          onChangeText={handleSearch}
        />

        {showResults && (
          <FlatList
            data={filteredUsers}
            keyExtractor={(user) => user.id}
            renderItem={renderItem}
          />
        )}
      </View>
      <BottomTabs/>
    </View>
  );
};

export default SearchScreen;
