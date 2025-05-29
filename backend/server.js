import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import http from "http"
import { Server } from "socket.io" 

// DB + Socket logic
import { connectDB } from "./config/db.js"
import { messageSocketHandler } from "./sockets/messageSocket.js" 
import { notificationSocketHandler } from "./sockets/notificationsSocket.js"
// Routes
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import messageRoutes from "./routes/messagesRoutes.js"
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
})

app.use(cookieParser())
app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/profile", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/chat",chatRoutes)
app.use("/api/messages",messageRoutes)
//Connect to MongoDB before starting the server
connectDB()

//Register Socket.IO logic (join/send/receive)
messageSocketHandler(io)
notificationSocketHandler(io)

app.set("io",io)
//Start HTTP + WebSocket server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
