import express from "express"
import "dotenv/config"

const app = express()

app.get("/", (req,res)=>{
    return res.json({
        msg:"this is health"
    })
})

app.listen(5000, () => {
    console.log("server is running");
})