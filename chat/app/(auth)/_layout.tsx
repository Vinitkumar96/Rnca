import React from "react";
import { Stack } from "expo-router";
import { Colors } from "@/constants/colors";
import { StatusBar } from "expo-status-bar";

const authLayout = () => {
  return (
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      />
  );
};

export default authLayout;
