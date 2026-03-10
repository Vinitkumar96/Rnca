import { Router } from "express";
import { requireAuth } from "../../lib/require-auth.js";
import { discover, listFriends, sendRequest } from "./friend.controller.js";

export const friendRouter = Router()

friendRouter.use(requireAuth)

// send request 
friendRouter.post("/request",sendRequest)
//  list all your friends
friendRouter.get("/list", listFriends)
// discover other
friendRouter.get("/discover", discover)