import { Router } from "express";
import { protectedRoute,getConversationForSidebar,getMessages,sendMessages } from "../middleware/auth.middleware.js";
import { upload } from './../middleware/upload.middleware.js';

const router=Router();
// /api/messages


router.use(protectedRoute)
router.get("/users",getUsersForSidebar)
router.get("/conversation",getConversationForSidebar)
router.get("/:id",getMessages)
router.post("/send/:id",upload.single("media"),sendMessages)

router.post()

export default router;