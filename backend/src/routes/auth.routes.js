import { Router } from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { checkAuth } from "../controllers/auth.controller.js";

const router=Router();

router.get("/check",protectedRoute,checkAuth);

export default router;