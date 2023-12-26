import { View, Text } from 'react-native'
import { useSafeAreaInsets } from "react-native-safe-area-context";

import React from 'react'

const Infor = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        flex: 1,
      }}>
      <Text>Infor</Text>
    </View>
  )
}

export default Infor