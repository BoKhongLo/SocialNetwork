import React, { useState } from "react";
import { View, TextInput, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UserItem from "../components/Search/UserItem";
import { Divider, Text } from "react-native-elements";
import BottomTabs from "../components/Home/BottomTabs";
import { TouchableOpacity } from "react-native-gesture-handler";
import { widthPercentageToDP } from "react-native-responsive-screen";
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
        user.nickname.toLowerCase().includes(text.toLowerCase())
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TextInput
            style={{
              height: 50,
              marginBottom: 10,
              padding: 10,
              fontSize: 18, // Đặt kích thước font theo mong muốn
              borderRadius: 40,
              paddingLeft: 20, // Vị trí của chữ từ bên trái
              backgroundColor: "lightgray",
              flex: 0.9,
            }}
            placeholder="Search"
            value={searchText}
            onChangeText={handleSearch}
          />
          <TouchableOpacity
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: "lightgrey",
              borderRadius: 20,
            }}
          >
            <Text>Nút</Text>
          </TouchableOpacity>
        </View>

        {showResults && (
          <FlatList
            data={filteredUsers}
            keyExtractor={(user) => user.id}
            renderItem={renderItem}
          />
        )}
      </View>
      <BottomTabs />
    </View>
  );
};

export default SearchScreen;