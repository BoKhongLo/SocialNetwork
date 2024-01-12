import { View, Text, TextInput, StyleSheet  } from 'react-native'
import React, { useState } from 'react'
import chat from '../../styles/chatStyles';

const Search = ({dataRoomchat, onSearch}) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (text) => {
    onSearch(preRoom => dataRoomchat.filter(room => room.title.includes(text)))
    setSearchText(text);
  }

  return (
    <View style={chat.searchContainer}>
      <TextInput
        style={chat.searchInput}
        placeholder="Tìm kiếm"
        value={searchText}
        onChangeText={handleSearch}
      />
    </View>
  );
}
export default Search