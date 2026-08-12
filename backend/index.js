import express from "express"
import dotenv from "dotenv"
dotenv.config()//dotenv is configurated

import connectDB from "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import cors from "cors"
import shopRouter from "./routes/shop.route.js"
import itemRouter from "./routes/item.route.js"
import orderRouter from "./routes/order.route.js"
import http from "http"
import { Server } from "socket.io"
import { socketHandler } from "./socket.js"


const app=express()
const server=http.createServer(app)

const io=new Server(server,{
   cors:{
    origin:"http://localhost:5173",
    credentials:true,
    methods:['POST','GET']
}

})

app.set("io",io)


const port=process.env.PORT || 5000
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
//GLOBAL MIDDLEWARE
app.use(express.json())
app.use(cookieParser())

//ROUTER MIDDLEWARE
app.use("/api/auth", authRouter)

/*
Browser
   │
GET /api/user/current-user
   │
   ▼
app.use("/api/user", userRouter)
   │
   ▼
userRouter
   │
router.get("/current-user", isAuth, getCurrentUser)
   │
   ▼
isAuth Middleware
   │
next()
   │
   ▼
getCurrentUser Controller
*/
app.use("/api/user", userRouter)
app.use("/api/shop", shopRouter)
app.use("/api/item", itemRouter)
app.use("/api/order", orderRouter)

socketHandler(io)
server.listen(port,()=>{
    connectDB()
    console.log(`server started at ${port}`)
})