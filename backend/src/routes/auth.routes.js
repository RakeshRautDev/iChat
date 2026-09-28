import { Router } from "express";
import { protectedRoute } from "../middleware/auth.middleware";


const router=Router();

router.get("/check",protectedRoute,checkAuth);

export default router;