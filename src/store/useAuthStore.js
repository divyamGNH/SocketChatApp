import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

// const baseUrl = "http://localhost/3000/api";

//Creating a store folder for global variables and zustand is the standard method

//We have created global variables that can be accesed anywhere using zustand that is why we have not used the useState and useEffect from react

export const useAuthStore = create((set, get) => ({
  //These are the global variables we have declared
  authUser: null,
  isCheckingAuth: false,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  //   socket: null,

  checkAuth: async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/auth/check", { withCredentials: true });
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  //The frontend is basically sending the data to the backend so the data is all that info.
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axios.post("http://localhost:3000/api/auth/signup", data, { withCredentials: true });
      set({ authUser: res.data });
      toast.success("Account created succesfully !");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async(data) =>{
    set({isLoggingIn : true});
    try {
        const res = await axios.post("http://localhost:3000/api/auth/login", data, { withCredentials: true });
        set({authUser : res.data});
        toast.success("Logged in succesfully !");
    } catch (error) {
        toast.error(error.response.data.message);
    } finally{
        set({isLoggingIn:false});
    }
  },

  logout: async() => {
    try {
        const res = await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
        set({authUser:null});
        toast.success("Logged out succesfully !");
    } catch (error) {
        toast.error(error.response.data.message);
    }
  },
}));
