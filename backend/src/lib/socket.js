import express from "express";
import http from "http";
import { Server } from "socket.io";
import userModel from "../models/user.model.js";

const app = express();
const server = http.createServer(app);

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

const io = new Server(server, {
    cors: {
        origin: [allowedOrigin],
        credentials: true,
    }
});

// mongoId → socketId  (all lookups in controllers use MongoDB _id)
const userSocketMap = {};

export function getReceiverSocketId(userId) {
    return userSocketMap[String(userId)];
}

io.on("connection", async (socket) => {
    // Frontend sends the Clerk user ID in the query
    const clerkId = socket.handshake.query.userId;

    if (!clerkId) {
        console.log(`⚠️  [SOCKET] Anonymous connection | socketId: ${socket.id}`);
        return;
    }

    try {
        // Resolve Clerk ID → MongoDB _id so all socket lookups use the same ID
        // as the message controller (which works with req.user._id = MongoDB _id)
        const user = await userModel.findOne({ clerkId });

        if (!user) {
            console.log(`⚠️  [SOCKET] No DB user for clerkId: ${clerkId}`);
            return;
        }

        const mongoId = String(user._id);
        userSocketMap[mongoId] = socket.id;

        console.log(`\n✅ [SOCKET] Connected   | mongoId: ${mongoId} | socketId: ${socket.id}`);

        const onlineUsers = Object.keys(userSocketMap);
        console.log(`   Online (${onlineUsers.length}):`, onlineUsers);
        io.emit("getOnlineUsers", onlineUsers);   // broadcast MongoDB _id list

        socket.on("disconnect", () => {
            delete userSocketMap[mongoId];
            console.log(`\n❌ [SOCKET] Disconnected | mongoId: ${mongoId} | socketId: ${socket.id}`);

            const onlineUsers = Object.keys(userSocketMap);
            console.log(`   Online (${onlineUsers.length}):`, onlineUsers);
            io.emit("getOnlineUsers", onlineUsers);
        });

    } catch (err) {
        console.error("[SOCKET] Error resolving user:", err.message);
    }
});

export { app, server, io };