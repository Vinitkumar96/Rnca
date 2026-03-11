import { prisma } from "../../lib/db.js"

function normalizePair(a,b){
    return a < b ? [a,b] : [b,a]
}

export async function sendFriendRequest(senderId,receiverId) {
    
}


export async function getFriendsDeatil(userId) {
    
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