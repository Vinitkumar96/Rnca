import acceptFriendRequest, { discoverUsers, getFriendsDeatil, sendFriendRequest,rejectFriendRequest } from "./friend.service.js"

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

export async function acceptRequest(req,res){
    try{
        const userId = req.user.id
        const {requestId} = req.params;

        const result = await acceptFriendRequest(requestId,userId)
        return res.json(result)
    }catch(error){
        return res.status(400).json({message:error.message || "Failed to accept request"})
    }
}

export async function rejectRequest(req,res){
    try{
        const userId =  req.user.id
        const{requestId} = req.params

        const result = rejectFriendRequest(requestId,userId)
        return res.json(result)
    }catch(error){
        return res.status(400).json({message:error.message || "Failed to reject request"})
    }
}

export async function cancelRequest(req,res){
    try{

    }catch(error){
        
    }
}