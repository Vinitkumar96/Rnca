import { discoverUsers, getFriendsDeatil, sendFriendRequest } from "./friend.service.js"

export async function sendRequest(req,res){
    try{
        const senderId = req.user.id
        const {receiverId} = req.body

        const result = await sendFriendRequest(senderId,receiverId)

        return res.json(result)
    }catch(error){
        return res.status(500).json({message:error.message || "Failed to send Request"})
    }
}

export async function listFriends(req,res){
    try{
        const userId = req.user.id 
        const data = await getFriendsDeatil(userId)

        return res.json(data)
    }catch(error){
        return res.status(500).json({message:error.message || "Failed to list friends"})
    }
}

export async function discover(req,res){
    try{
        const userId = req.user.id
        const search = req.query.search

        const data = await discoverUsers(userId,search)

        return res.json(data)
    }catch(error){
        res.status(500).json({message:error.message || "Failed to discover users"})
    }
}