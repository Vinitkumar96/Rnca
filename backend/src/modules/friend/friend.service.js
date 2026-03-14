import { prisma } from "../../lib/db.js"

function normalizePair(a,b){
    return a < b ? [a,b] : [b,a]
}

export async function sendFriendRequest(senderId,receiverId) {
    //1 first we will check for receiverid and see if we are not sending request to yourself
   if(!receiverId) throw new Error("receiver id is required")

    if(senderId === receiverId){
        throw new Error("You cannot send friend request to yourself")
    }

    //2 now we will normalize and then check for existing friend request ... in the friends table
    const[u1,u2] = normalizePair(senderId,receiverId)

    const existingFriends = await prisma.friend.findFirst({
        where:{
            userId1:u1,
            userId2:u2
        },
        select:{
            id:true
        }
    })

    if(existingFriends) throw new Error("You are already friends")

    //3 now we will check if there is already a request between the two of you .... in the friendRequest table
    const existing = await prisma.friendRequest.findFirst({
        where:{
            OR:[
                {senderId,receiverId},
                {senderId:receiverId, receiverId:senderId}
            ],
        }
    })

    if(existing){
        if(existing.status === "PENDING"){
            throw new Error("Friend request already sent")
        }

        if(existing.status === "REJECTED" || existing.status === "CANCELLED"){
           const updated =  await prisma.friendRequest.update({
                where:{
                    id: existing.id
                },
                data:{
                    status: "PENDING"
                }
            })
            return{
                success:true,
                message:"Friend request sent successfully",
                id:updated.id
            }
        }

        if(existing.status === "ACCEPTED"){
            throw new Error("You are already friends")
        }
    }

    // if nothing above is true and we need to create a fresh request ...then we will create a new entry in the table
    const c = await prisma.friendRequest.create({
        data:{
            senderId,
            receiverId,
            status:"PENDING"
        }
    })
    return{
        success:true,
        message:"Friend request sent successfully",
        id:c.id
    }
}

// "Give me all friends of this user with their details"
export async function getFriendsDeatil(userId) {
    const links = await prisma.friend.findMany({
        where:{
            OR:[
                {userId1:userId},
                {userId2:userId}
            ]
        },
        include:{
            user1: {select:{id:true, name:true, email:true, image:true}},
            user2: {select:{id:true, name:true, email:true, image:true}}
        },
        orderBy:{
            createdAt:"desc"
        }
    })

    //for each friendship row we return the other person not mee...
    return links.map((l) => (l.userId1 === userId ? l.user2 : l.user1))

}


export async function discoverUsers(userId,search="") {
    const q = search.trim()

    const users = await prisma.user.findMany({
        where:{
            id:{not:userId},
            ...(
                q ? {
                    OR:[
                        {name:{contains:q, mode:"insensitive"}},
                        {email:{contains:q, mode:"insensitive"}}
                    ]
                } : {}
            )
        },
        select:{
            id:true,
            name:true,
            email:true,
            image:true
        },
        orderBy:{
            createdAt: "desc"
        },
        take:50
    })

    if(users.length === 0){
        return []
    }

    const ids = users.map((u) => u.id)

    const friendPairs = ids.map((id) => {
        const[u1,u2] = normalizePair(userId,id)

        return { userId1:u1, userId2:u2 }
    })

    const [friends,outgoing,incoming] =  await Promise.all([

        prisma.friend.findMany({
            where:{OR:friendPairs},
            select:{
                userId1: true,
                userId2: true,
            }
        }),

        prisma.friendRequest.findMany({
            where:{
                senderId:userId,
                receiverId: {in: ids},
                status:"PENDING"
            },
            select:{
                receiverId:true,
                id:true
            }
        }),

        prisma.friendRequest.findMany({
            where:{
                receiverId:userId,
                senderId:{in: ids},
                status:"PENDING"
            },
            select:{
                senderId: true,
                id: true
            }
        })
    ])

    const friendSet = new Set(friends.map((f) => {
        const[u1,u2] = normalizePair(f.userId1, f.userId2)
        return `${u1}:${u2}`
    }))
    // set of id jinko maine request bheja
    const outgoingSet = new Set(outgoing.map((r) => r.receiverId))

    const incomingSet = new Set(incoming.map((r) => r.senderId))


    return users.map((u) => {
    const [u1, u2] = normalizePair(userId, u.id);
    const key = `${u1}:${u2}`;

    let relationship = "NONE";
    let friendRequestId = null;

    if (friendSet.has(key)) {
      relationship = "FRIEND";
    } else if (outgoingSet.has(u.id)) {
      relationship = "REQUEST_SENT";
      friendRequestId = outgoing.find((r) => r.receiverId === u.id)?.id;
    } else if (incomingSet.has(u.id)) {
      relationship = "REQUEST_RECEIVED";
      friendRequestId = incoming.find((r) => r.senderId === u.id)?.id;
    }

    return {...u , relationship , friendRequestId}
  });
}

export default async function acceptFriendRequest(requestId, receiverId){
    const friendRequest = await prisma.friendRequest.findFirst({
        where:{
            id:requestId,
            receiverId,
            status:"PENDING"
        }
    })

    if(!friendRequest){
        throw new Error("Friend request not found")
    }

    const {senderId} = friendRequest

    const[u1,u2] = normalizePair(receiverId,senderId)

    await prisma.$transaction([

        prisma.friendRequest.update({
            where:{
                id:requestId,
            },
            data:{
                status:"ACCEPTED"
            }
        }),

        prisma.friend.upsert({
            where:{
                userId1_userId2:{userId1:u1, userId2:u2}
            },
            create:{
                userId1:u1,
                userId2:u2
            },
            update:{}
        })
    ])

         return {
            success:true,
            message:"Friend request accepted successfully"
        }
}


export default async function rejectFriendRequest(requestId,receiverId) {
    const friendRequest = await prisma.friendRequest.findFirst({
        where:{
            id:requestId,
            receiverId,
            status:"PENDING"
        }
    })

    if(!friendRequest){
        throw new Error("Friend request not found")
    }

    await prisma.friendRequest.update({
        where:{
            id:requestId,
            receiverId,
            status:"PENDING"
        },
        data:{
            status:"REJECTED"
        }
    })

    return{
        success:true,
        message:"Friend request rejected successfully"
    } 
} 

export default async function cancelFriendRequest(requestId,senderId){
    const friendRequest = await prisma.friendRequest.findFirst({
        where:{
            id:requestId,
            senderId,
            status:"PENDING"
        }
    })

    if(!friendRequest){
        throw new Error("Friend request was not found")
    }

    await prisma.friendRequest.update({
        where:{
            id:requestId,
            senderId
        },
        data:{
            status:"CANCELLED"
        }
    })
}