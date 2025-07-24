import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

// GET all users except the logged-in user
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// GET all messages between two users
export const getMessages = async (req, res) => {
    try {
        const userToChatId = req.params.id; // fix: destructure directly
        const loggedInUserId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId, recieverId: userToChatId },
                { senderId: userToChatId, recieverId: loggedInUserId }
            ]
        }).sort({ createdAt: 1 }); // optional: sort chronologically

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// POST a new message
export const sendMessages = async (req, res) => {
    try {
        const { text, image } = req.body;
        const recieverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl = null;

        if (image) {
            const uploadedImage = await cloudinary.uploader.upload(image);
            imageUrl = uploadedImage.secure_url;
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        // TODO: Add socket logic here

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessages:", error);
        res.status(500).json({ error: "Server Error" });
    }
};
