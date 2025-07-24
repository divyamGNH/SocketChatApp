import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios"; // you forgot this import

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axios.get("http://localhost:3000/api/messages/users", {
        withCredentials: true,
      });
      set({ users: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to get users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axios.get(`http://localhost:3000/api/messages/${userId}`, {
        withCredentials: true,
      });
      set({ messages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to get messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axios.post(
        `http://localhost:3000/api/messages/send/${selectedUser._id}`,
        messageData,
        { withCredentials: true }
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
