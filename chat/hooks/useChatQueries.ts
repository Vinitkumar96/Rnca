import { queryClient } from "@/lib/query-client"
import {chatService} from "@/services/chat.service"
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"

export const CHAT_KEYS = {
    all: ["chats"] as const,
    conversations: () => [...CHAT_KEYS.all, "conversations"] as const,
    messages: (userId:string) => [...CHAT_KEYS.all,"messages",userId] as const
}

export function useConversation(){
    return useQuery({
        queryKey:CHAT_KEYS.conversations(),
        queryFn: () => chatService.getConversations(),
        staleTime:1000*30
    })
}

export function useSendMessage(){
    return useMutation({
        mutationFn: ({receiverId, content}: {receiverId:string, content:string}) => chatService.sendMessage(receiverId,content),
        onSuccess: (_, {receiverId}) => {
            // refetch messages after sending
            queryClient.invalidateQueries({
                queryKey: CHAT_KEYS.messages(receiverId)
            })

             // refetch conversation to update last message
            queryClient.invalidateQueries({
                queryKey: CHAT_KEYS.conversations()
            })
        }
       
    })
}

export function useMessages(otherUserId:string){
    return useInfiniteQuery({
        queryKey: CHAT_KEYS.messages(otherUserId),
        queryFn: ({pageParam}) => chatService.getMessage(otherUserId,50,pageParam),

        initialPageParam: undefined,

        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined
    })
}

