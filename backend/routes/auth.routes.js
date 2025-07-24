import express from "express";
// import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
// import { checkAuth, login, logout, signup} from "../controllers/auth.controller.js";
import { checkAuth, login, signup, logout} from "../controllers/auth.controllers.js"

import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);

// router.put("/update-profile", protectRoute, updateProfile);

//check if the user is logged in or not in other words verify the tokens
router.get("/check",protectedRoute,checkAuth);

export default router;