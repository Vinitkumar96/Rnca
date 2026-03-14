import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { API_URL } from ".";

export const authClient = createAuthClient({
    baseURL: API_URL, // Base URL of your Better Auth backend.
    plugins: [
        expoClient({
            scheme: "chat",
            storagePrefix: "chat",
            storage: SecureStore,
        })
    ]
});