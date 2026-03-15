import { API_URL } from "@/lib";
import { authClient } from "@/lib/auth-client";

async function getHeaders(){
    const cookie =  authClient.getCookie() ?? ""
    return  {
        "Content-Type":"application/json",
        ...(cookie ? {Cookie:cookie} : {})
    }
}

export const friendService = {

    getFriends: async () => {
        const headers = await getHeaders()
        const res = await fetch(`${API_URL}/api/friend/list`,{
            method:"GET",
            headers
        })

        const data = await res.json()
        if(!res.ok){
            throw new Error(data.message || "Failed to fetch friends")
        }
        return data
    },

    discoverUsers: async(search:string = "") => {
        const headers = await getHeaders()
        const url = `${API_URL}/api/friend/discover?search=${encodeURIComponent(search)}`
        try{
            const res = await fetch(url,{
                method:"GET",
                headers,
            })

            if(!res.ok){
                console.error("Discover users failed")
                throw new Error(`Failed to discover users: ${res.status}`)
            }
            return res.json();
        }catch(error){
            console.error("Network error in discoverUsers:",error)
            throw error
        }
    },

    sendFriendRequest: async(recieverId: string) => {
        const headers = await getHeaders()
        const res = await fetch(`${API_URL}/api/friend/request`,{
            method:"POST",
            headers,
            body:JSON.stringify({recieverId})
        })
        const data = await res.json()
        if(!res.ok) throw new Error(data.message || "Failed to send request")
        return data;
    },

    acceptFriendRequest : async(requestId:string) => {
        const headers = await getHeaders()
        const res = await fetch(`${API_URL}/api/friend/request/id/${requestId}/accept`, {
            method:"POST",
            headers
        })
        const data = await res.json()
        if(!res.ok) throw new Error(data.message || "Failed to accept request")

        return data
    },

    rejectFriendRequest: async(requestId:string) => {
        const headers  = await getHeaders()
        const res = await fetch(`${API_URL}/api/friend/request/id/${requestId}/reject`,{
            method:"POST",
            headers
        })
        const data = await res.json()
        if(!res.ok) throw new Error(data.message || "Failed to reject request")

        return data
    },

    cancelFriendRequest: async(requestId:string) => {
        const headers = await getHeaders()
        const res = await fetch(`${API_URL}/friend/request/id/${requestId}/cancel`,{
            method:"POST",
            headers
        })
        const data = await res.json()
        if(!res.ok) throw new Error(data.message || "Failed to cancel request")

        return data
    }


}