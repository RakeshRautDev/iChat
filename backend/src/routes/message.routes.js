import { Router } from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { upload } from './../middleware/upload.middleware.js';
import {getConversationForSidebar,getMessages,sendMessages,getUsersForSidebar} from "../controllers/message.controller.js"

const router=Router();
// /api/messages


router.use(protectedRoute)
router.get("/users",getUsersForSidebar)
router.get("/conversation",getConversationForSidebar)
router.get("/:id",getMessages)
router.post("/send/:id",upload.single("media"),sendMessages)



export default router;