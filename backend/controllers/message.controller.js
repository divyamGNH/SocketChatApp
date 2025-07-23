import User from "../models/user.model";
import Message from "../models/message.model";
import cloudinary from "../lib/cloudinary.js";

//dont forget to put the console logs in the catch blocks

export const getUsersForSidebar = async(req,res) =>{
    try {
        //in the protected route we passed the req.user = user that is we passed the verified user that is what we are using
        const loggedInUserId = req.user._id;
        //remove all the users with same _id as the logged in user
        const filteredUser = await User.find({_id : {$ne:loggedInUserId}}).select("-password");

        res.status(200).json(filteredUser);

    } catch (error) {
        
    }
}

export const getMessages = async(req,res) =>{
    try {
        const {id:userToChatId} = req.params.id;
        const loggedInUserId = req.user._id;

        const messages = await User.find({
            $or:[
                {senderId : loggedInUserId , recieverId : userToChatId},
                {senderId : userToChatId , recieverId : loggedInUserId}
            ]
        });

        res.statud(200).json(messages);
    } catch (error) {
        
    }
}

export const sendMessages = async(req,res) =>{
    try {
        const {text,image} = req.body;
        const recieverId = req.params.id;
        const senderId = req.user.id;

        let imageUrl;
        if(image){
            const uploadImage = await cloudinary.uploader.upload(image);
            imageUrl = uploadImage.secure_url;
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image :imageUrl
        });

        await newMessage.save();

        //socket real time logic

    } catch (error) {
        
    }
}