import express from "express";
import { protectedRoute } from "../middleware/auth.middleware";
import { getUsersForSidebar,getMessages, sendMessages } from "../controllers/message.controller";

const router = express.Router();

router.get("/users",protectedRoute, getUsersForSidebar);
//The id is being passed on by the frontend so we do not need to worry that where did the id come from
router.get("/:id",protectedRoute, getMessages);

router.post("/send/:id", protectedRoute, sendMessages);

export default router;