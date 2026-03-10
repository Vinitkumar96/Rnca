import express from "express"
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import "dotenv/config"
import { friendRouter } from "./modules/friend/friend.routes.js";

const app = express()

app.all("/api/auth/{*any}", toNodeHandler(auth));
// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth
app.use(express.json());

app.use("/api/friend",friendRouter)

app.get("/", (req,res)=>{
    return res.json({
        msg:"this is health"
    })
})

app.listen(5000, () => {
    console.log("server is running");
})