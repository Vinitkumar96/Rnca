import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
    baseURL: "http://10.247.190.120:5000", // Base URL of your Better Auth backend.
    plugins: [
        expoClient({
            scheme: "chat",
            storagePrefix: "chat",
            storage: SecureStore,
        })
    ]
});