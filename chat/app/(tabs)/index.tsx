import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';
import { authClient } from '@/lib/auth-client';

async function pingBackend(){
  const res = await fetch("http://10.133.124.120:5000");
  const data = await res.json()
  console.log(data);
}



const HomeScreen = () => {
const {data} = authClient.useSession()

  return (
    <View>
      <Text>HomeScreen</Text>
      <Text>
      {
        JSON.stringify(data?.user, null,2)
      }
      </Text>

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