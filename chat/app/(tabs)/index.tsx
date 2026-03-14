import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';
import { authClient } from '@/lib/auth-client';
import { useAuth } from '@/context/auth-context';



const HomeScreen = () => {
const {data} = authClient.useSession()
const {signOut}  = useAuth()

  return (
    <View>
      <Text>HomeScreen</Text>
      <Text>
      {
        JSON.stringify(data?.user, null,2)
      }
      </Text>

      <Pressable onPress={signOut}>
        <Text>
          Sign Out
        </Text>
      </Pressable>

    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  btn:{
    backgroundColor:"black",
    borderRadius:10,
    padding:5,
  }
})