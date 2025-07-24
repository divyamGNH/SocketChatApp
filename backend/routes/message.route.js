import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar, getMessages, sendMessages } from "../controllers/message.controller.js";

const router = express.Router();

// Get all users except logged-in user
router.get("/users", protectedRoute, getUsersForSidebar);

// Get all messages between logged-in user and user with :id
router.get("/:id", protectedRoute, getMessages);

// Send a message to user with :id
router.post("/send/:id", protectedRoute, sendMessages);

export default router;
