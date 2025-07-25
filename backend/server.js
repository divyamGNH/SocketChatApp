import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db.js";

import {app, server} from "./lib/socket.js";

import auth from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT;

// const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth",auth);
app.use("/api/messages", messageRoutes);

server.listen(PORT,()=>{
    console.log(`Server listening on PORT :${PORT}`);
})