import { API_URL } from "@/lib";
import { authClient } from "@/lib/auth-client";

async function getHeaders(){
    const cookie =  authClient.getCookie() ?? ""
    return  {
        "Content-Type":"application/json",
        ...(cookie ? {Cookie:cookie} : {})
    }
}

export interface Message {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: string;
}

export interface chatUser  {
    id: string;
    name: string;
    image?: string;
    lastMessage?: Message | null;
    unreadCount?: number
}

export const chatService = {

    sendMessage: async(receiverId:string, content:string) => {
        const headers =  await getHeaders()
        const res = await fetch(`${API_URL}/api/chat/send`,{
            method:"POST",
            headers,
            body:JSON.stringify({receiverId,content})
        })

        const data = await res.json()
        if(!res.ok){
            throw new Error("Failed to send Messages")
        }
        return data
    },
    getMessage : async(otherUserId:string, limit?:number, cursor?:string) => {
        const headers = await getHeaders();
        const params = new URLSearchParams()
        
        if(limit)params.append("limit",limit.toString())
        if(cursor)params.append("cursor",cursor)

        const queryString = params.toString()

        const url = `${API_URL}/api/chat/messages/${otherUserId}${queryString ? `?${queryString}` : ""}`

        const res = await fetch(url, {
            method:"GET",
            headers
        })

        const data = await res.json()
        if(!res.ok){
            throw new Error("Failed to fetch conversations")
        }

        return data
    },
    getConversation: async() => {
        const headers = await getHeaders()
        const res = await fetch(`${API_URL}/api/chat/conversations`, {
            method:"GET",
            headers
        })
        const data = await res.json()
        if(!res.ok){
            throw new Error("Failed to fetch Conversation")
        }
        return data
    },
    markRead: async(senderId:string) => {
        const headers =  await getHeaders()
        const res = await fetch(`${API_URL}/api/chat/mark-read`,{
            method:"POST",
            headers,
            body:JSON.stringify({senderId})
        })
        const data = await res.json()
        if(!res.ok){
            throw new Error("Failed to mark messages as read")
        }
        return data;
    }
}