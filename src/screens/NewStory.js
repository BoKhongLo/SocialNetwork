import { View, Text } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NewStory = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left+10,
        paddingRight: insets.right+10,
        flex: 1,
      }}>
      <Text>New Story</Text>
    </View>
  )
}

export default NewStory