import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';

async function pingBackend(){
  const res = await fetch("http://10.247.190.120:5000");
  const data = await res.json()
  console.log(data);
}

const HomeScreen = () => {
  return (
    <View>
      <Text>HomeScreen</Text>
      <Pressable style={styles.btn} onPress={pingBackend}>
        <Text style={{color:"white"}}>Ping backend</Text>
      </Pressable>

    <Link href="/(auth)/sign-in" asChild>
      <Pressable>
        <Text>take me to sign in</Text>
      </Pressable>
      </Link>


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