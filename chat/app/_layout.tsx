import { Stack } from "expo-router";
import SafeScreen from "@/components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";

export default function RootLayout() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
      <Layout />
      </QueryClientProvider>
    </AuthProvider>
  );
}

function Layout() {
  const { user, isLoading } = useAuth();

  const isLoggedIn = !!user;
  return (
    <SafeScreen>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
      </Stack>
      <StatusBar style="light"/>
    </SafeScreen>
  );
}
