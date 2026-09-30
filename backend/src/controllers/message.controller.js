import userModel from "../models/user.model.js";
import messageModel from './../models/message.model.js';
import {hasImageKitConfig , uploadChatMedia } from "../lib/imagekit.js"
import { getReceiverSocketId,io } from "../lib/socket.js";

export const getUsersForSidebar=async(req,res,next)=>{
    try {
        const loggedInUserId=req.user._id;

        const filteredUsers=await userModel.find({_id:{$ne:loggedInUserId}}).select("-clerkId");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar ",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const getConversationForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const conversations = await messageModel.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: loggedInUserId },
                        { receiverId: loggedInUserId }
                    ]
                }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$senderId", loggedInUserId] },
                            "$receiverId",
                            "$senderId"
                        ]
                    },
                    lastMessageAt: { $max: "$createdAt" }
                }
            },
            {
                $sort: {
                    lastMessageAt: -1
                }
            },
            {
                $lookup:{
                    from:"users",localField:"_id",foreignField:"_id",as:"user"
                },
                
            },
            {
                    $replaceRoot:{newRoot:{$first:"$user"}}
            },
            {
                $project:{clerkId:0}
            }
        ]);

        res.status(200).json({
            success: true,
            conversations
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getMessages=async(req,res)=>{
    try {
        const {id:userToChatId}=req.params;
        const myId=req.user._id;

        const messages=await messageModel.find({
            $or:[{senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        }).sort({createdAt:1})
        res.status(200).json(messages);
    } catch (error) {
        
    }
}


export const sendMessages=async(req,res)=>{
    try {
        const{text}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id;

        let imageUrl;
        let videoUrl;
        if(req.file){
            if(!hasImageKitConfig()){
                return res.status(500).json({message:"Media upload is not configured"});
            }

            const url=await uploadChatMedia(req.file);
            if(req.file.mimetype.startsWith("video/")) videoUrl=url;
            else imageUrl=url;
        }


       const newMessage=await messageModel.create({senderId,receiverId,text,image:imageUrl,video:videoUrl});
      
       //todo: add sockets to send so user dont have to reload

       const receiverSocketId=getReceiverSocketId(receiverId)
       if(receiverSocketId)io.to(receiverSocketId).emit("New Message",newMessage);


        res.status(201).json(newMessage);
       
    } catch (error) {
        console.error("Message Controller error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send message"
        });
    }
}