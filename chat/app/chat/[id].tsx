import React from 'react'
import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

const chat = () => {
    const {id} = useLocalSearchParams()
  return (
    <View>
        <Text>hi</Text>
        <Text>{id}</Text>
    </View>
  )
}

export default chat