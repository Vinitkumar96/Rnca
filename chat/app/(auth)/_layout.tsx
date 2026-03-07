import React from 'react'
import { Stack } from 'expo-router'
import {Colors} from "@/constants/colors"

const authLayout = () => {
  return (
    <Stack
        screenOptions={{
            headerShown:false,
            contentStyle:{
                backgroundColor:Colors.background
            }
        }}
    />
  )
}

export default authLayout