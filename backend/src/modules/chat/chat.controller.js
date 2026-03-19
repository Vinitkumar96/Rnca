import { getConversation, getMessages, markMessagesAsRead, sendMessage } from "./chat.service.js";

export async function send(req, res) {
  try {
    const senderId = req.user.id;
    const { receiverId, content } = req.body;

    const result = await sendMessage(senderId, receiverId, content);

    // TODO: websocket and notification

    return res.json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Failed to send message",
    });
  }
}

// /api/chat/messages/vinit-id?limit=50&cursor=2024-01-01T10:00:00Z

export async function listMessages(req, res) {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    const { limit, cursor } = req.query;

    const result = await getMessages(
      userId,
      otherUserId,
      limit ? parseInt(limit) : undefined,
      cursor || undefined,
    );
    return res.json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Failed to list messages",
    });
  }
}

export async function markRead(req, res) {
    try{
        const userId = req.user.id
        const {senderId} = req.body

        await markMessagesAsRead(userId,senderId)

        // TODO: websocket

        return res.json({
            success:true
        })
    }catch(error){
        return res.status(400).json({
            message: error.message || "Failed to mark messages as read"
        })
    }
}

export async function listConversations(req, res) {
    try{
        const userId = req.user.id
        const result = await getConversation(userId)

        return res.json(result)
    }catch(error){
        return res.status(400).json({
            message:error.message || "Failed to fetch conversations"
        })
    }
}
