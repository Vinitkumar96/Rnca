import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const HomeScreen = () => {
  return (
    <View>
      <Text>HomeScreen</Text>
      <Pressable style={styles.btn}>
        <Text style={{color:"white"}}>Ping backend</Text>
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