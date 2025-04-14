
require("dotenv").config(); // <-- This must come first
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messageRoute");
const socket = require("socket.io");
const path = require("path");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connected Successfully");
  })
  .catch((error) => {
    console.error("DB Connection Failed:", error);
  });

const _dirname = path.resolve();

app.use(express.static(path.join(_dirname, "/public/dist")))
app.get('*',(req,res)=>{
  res.sendFile(path.resolve(_dirname,"public","dist","index.html"));
})
// Start Server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server Started on port ${process.env.PORT}`);
});

// Socket.io Setup
const io = socket(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Corrected typo from "Credential"
  },
});

// Map to keep track of online users
global.onlineUsers = new Map();

// Socket Events
io.on("connection", (socket) => {
  global.chatSocket = socket;

  // Add user to online users map
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // Send message to another user
  socket.on("send-msg", (data) => {
    if (!data.to || !data.msg) return;

    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.msg);
    }
  });

  // Remove user from map on disconnect
  socket.on("disconnect", () => {
    for (const [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});
