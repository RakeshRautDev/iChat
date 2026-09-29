import { getAuth } from "@clerk/express";
import userModel from "../models/user.model.js";

export async function protectedRoute(req,res,next){
    try {
        const {userId}=getAuth(req);

        if(!userId){
            res.status(401).json({message:"Unauthorized"});
            return;
        }

        const user=await userModel.findOne({clerkId:userId});
        if(!user){
            res.status(404).json({message:"User profile is not synced yet"});
            return;
        }
        req.user=user;
    } catch (error) {
        console.log("Errror in Protected Route",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

