import { View, Text, TextInput, StyleSheet  } from 'react-native'
import React, { useState } from 'react'
import chat from '../../styles/chatStyles';

const Search = ({dataRoomchat}) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    // lam gi do voi cai searchText !!
  }

  return (
    <View style={chat.searchContainer}>
      <TextInput
        style={chat.searchInput}
        placeholder="Tìm kiếm"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
    </View>
  );
}
export default Search