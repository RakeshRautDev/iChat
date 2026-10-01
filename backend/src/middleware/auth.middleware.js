import { getAuth } from "@clerk/express";
import userModel from "../models/user.model.js";

export async function protectedRoute(req,res,next){
    console.log(`[Auth Middleware] Checking auth for ${req.method} ${req.originalUrl}`);
    try {
        const {userId}=getAuth(req);

        if(!userId){
            console.log(`[Auth Middleware] Failed: No userId found in Clerk auth (Unauthorized)`);
            res.status(401).json({message:"Unauthorized"});
            return;
        }

        const user=await userModel.findOne({clerkId:userId});
        if(!user){
            console.log(`[Auth Middleware] Failed: User with Clerk ID ${userId} not found in database`);
            res.status(404).json({message:"User profile is not synced yet"});
            return;
        }
        
        console.log(`[Auth Middleware] Success: Authenticated as ${user._id}`);
        req.user=user;
        next();
    } catch (error) {
        console.log("Errror in Protected Route",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

