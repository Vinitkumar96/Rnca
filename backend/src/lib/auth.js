import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { expo } from "@better-auth/expo";

import { prisma } from "./db.js";

//this is yourrr betterauth instance vinit bhaii

export const auth = betterAuth({
  plugins: [expo()],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    // Basic scheme
    "chat://",

    // Production & staging schemes
    "chat-prod://",
    "chat-staging://",

    // Wildcard support for all paths following the scheme
    "chat://*",

    ...(process.env.NODE_ENV === "development"
        ? [
            "exp://", // Trust all Expo URLs (prefix matching)
            "exp://**", // Trust all Expo URLs (wildcard matching)
            "exp://192.168.*.*:*/**", // Trust 192.168.x.x IP range with any port and path
          ]
        : []
        )
  ],
  debug:process.env.NODE_ENV !== "production",
  allowDangerousConnections:process.env.NODE_ENV !== "production"
});
