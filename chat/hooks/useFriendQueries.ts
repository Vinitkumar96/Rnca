import { useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { friendService } from "@/services/friends.service";

export const USER_KEYS = {
    all: ["users"] as const,
    discover: (search:string) => [...USER_KEYS.all,"discover",search] as const,
    friends: () => [...USER_KEYS.all,"friends"] as const
}

// every diff search has its own cache entry
export function useDiscoverUsers(search:string){
    return useQuery({
        queryKey: USER_KEYS.discover(search),
        queryFn: () => friendService.discoverUsers(search)
    })
} 

// for friends list
export function useFriends(){
    return useQuery({
        queryKey: USER_KEYS.friends(),
        queryFn:() => friendService.getFriends(),
        staleTime: 1000 * 60 * 5
    })
}

export function useSendFriendRequest(){
    const queryClient = useQueryClient()
    return useMutation({
       mutationFn: (receiverId: string) => friendService.sendFriendRequest(receiverId), 
       onMutate: async (receiverId) => {
        // no other background fetch..might overwrite the ui
            await queryClient.cancelQueries({queryKey: USER_KEYS.all})
        // saving the snapshot of discover cache
            const previousDiscover = queryClient.getQueriesData({queryKey: ["users","discover"]})
        //updating ui instantly,,,no waittt
            queryClient.setQueriesData({queryKey:["users","discover"]}, (old:any[]) => {
                if(!old)return[]
                return old.map((user) => user.id === receiverId ? {...user,relationship:"REQUEST_SENT"} : user)
            })
            //return snapshot for rollback
            return {previousDiscover}
       },
       onError: (err,_,context) => {
        context?.previousDiscover?.forEach(([queryKey,data]) => {
            queryClient.setQueryData(queryKey,data)
        })
       },

       onSuccess:(data,receiverId) => {
        console.log(data,receiverId);
        // adding friendRequestid and relationship after the server response from mutateFn
        queryClient.setQueriesData({queryKey: ["users","discover"]}, (old:any[]) => {
            if(!old) return []
            return old.map((user) => user.id === receiverId ? {...user, relationship:"REQUEST_SENT",friendRequestId:data.id} : user)
        })
        // refetch discover to get the confirmed value...it also removes the previous querykey cache value
        queryClient.invalidateQueries({queryKey: ["users","discover"]})
       }
    })
}