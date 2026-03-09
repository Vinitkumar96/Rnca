import { authClient } from "@/lib/auth-client";

import { createContext, ReactNode, useContext } from "react";

export interface AuthUser {
    id: string,
    name:string,
    email: string,
    image?: string | null
}

interface AuthContextType { 
    user : AuthUser | null,
    token : string | null,
    isLoading: boolean,
    signIn: (email:string,password:string) => Promise<string | null>,
    signUp: (name:string,email:string,password:string) => Promise<string | null>,
    signOut: () => Promise<void>
    getCookie: () => string
}

const AuthContext = createContext<AuthContextType>({
    user:null,
    token:null,
    isLoading:false,
    signIn: async() => null,
    signUp: async() => null,
    signOut: async() => {},
    getCookie : () => ""
})


export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isPending, error } = authClient.useSession();

  const isLoading = isPending;

  const token = data?.session?.token!;

  const user:AuthUser | null = data?.user ? {
    id : data?.user.id,
    name: data?.user.name,
    email: data?.user.email,
    image: data?.user?.image
  } : null

  const signIn = async (
    email: string,
    password: string,
  ): Promise<string | null> => {
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });
      console.log("Sign in response", { data, error });

      if (error) {
        return error.message ?? "Sign in failed";
      }

      return null;
    } catch (error) {
      return "sign in failed";
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
  ): Promise<string | null> => {
    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      console.log("Sign up response:", { data, error });

      if (error) {
        return error.message ?? "Sign up failed";
      }

      return null;
    } catch (error) {
      return "Sign up failed";
    }
  };

  const signOut = async () => {
    await authClient.signOut();
  };

  const getCookie = () => {
    return authClient.getCookie() ?? ""
  }

  return (
    <AuthContext.Provider value={{user,token,isLoading,signIn,signUp,signOut,getCookie}}>
        {children}
    </AuthContext.Provider>
  )
}


export function useAuth(){
    return useContext(AuthContext)
}