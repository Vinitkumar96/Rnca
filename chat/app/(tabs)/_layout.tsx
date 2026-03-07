import React from 'react'
import { Tabs } from 'expo-router'
import { Colors } from '@/constants/colors'
import { Platform } from 'react-native'
import {Ionicons} from "@expo/vector-icons"

const TabLayout = () => {
  return (
    <Tabs
        screenOptions={{
            tabBarActiveTintColor:Colors.primary,
            tabBarInactiveTintColor:Colors.textMuted,
            tabBarStyle:{
                backgroundColor: Colors.surface,
                borderTopColor: Colors.border,
                borderTopWidth: 0.5,
                paddingTop:6,
                height:69
            },
            headerStyle:{
                backgroundColor:Colors.background
            },
            headerTintColor:Colors.textPrimary,
            headerShadowVisible:false,
          
        }}
    >
        <Tabs.Screen name="index"
            options={{
                title:"chats",
                tabBarIcon: ({color,size}) => (
                    <Ionicons name='chatbubbles-outline' size={size} color={color} />
                )
            }}
        />

        <Tabs.Screen name='discover'
            options={{
                title:"Discover",
                tabBarIcon: ({color,size}) => (
                    <Ionicons name='search-outline' size={size} color={color} />
                )
            }}
        />

        <Tabs.Screen name='Profile'
            options={{
                title:"Profile",
                tabBarIcon: ({color,size}) => (
                    <Ionicons name='person-outline' size={size} color={color} />
                )
            }}
        />
    </Tabs>
  )
}

export default TabLayout