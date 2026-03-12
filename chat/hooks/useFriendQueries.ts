import { useQuery} from "@tanstack/react-query";
import { friendService } from "@/services/friends.service";

export const USER_KEYS = {
    all: ["users"] as const,
    discover: (search:string) => [...USER_KEYS.all,"discover",search] as const,
    friends: () => [...USER_KEYS.all,"friends"] as const
}

export function useDiscoverUsers(search:string){
    return useQuery({
        queryKey: USER_KEYS.discover(search),
        queryFn: () => friendService.discoverUsers(search)
    })
}

export function useFriends(){
    return useQuery({
        queryKey: USER_KEYS.friends(),
        queryFn:() => friendService.getFriends(),
        staleTime: 1000 * 60 * 5
    })
}