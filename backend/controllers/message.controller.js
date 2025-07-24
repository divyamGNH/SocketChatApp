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
    const userToChatId = req.params.id;
    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: loggedInUserId }
      ]
    }).sort({ createdAt: 1 });

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
    const receiverId = req.params.id; // ✅ fixed typo
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Cannot send empty message" });
    }

    let imageUrl = null;

    if (image) {
      try {
        const uploadedImage = await cloudinary.uploader.upload(image);
        imageUrl = uploadedImage.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary upload failed:", uploadErr);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId, // ✅ correct field name
      text,
      image: imageUrl
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessages:", error.message);
    console.dir(error, { depth: null });
    res.status(500).json({ message: error.message || "Server Error" });
  }
};
