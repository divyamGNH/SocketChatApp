import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { Socket } from "socket.io-client";

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
  socket: null,

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

      get().connectSocket();
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

        //As soon as we login we want to connect the socket
        get().connectSocket();
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
        get().disconnectSocket();
    } catch (error) {
        toast.error(error.response.data.message);
    }
  },

  connectSocket: ()=>{
    const {authUser} = get();

    //Check is the user is authenticated or not and also check if the socket is already connected or not if already connected no need to connect it again
    if(!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL);
    socket.connect();
    set({socket : socket});
  },

  disconnectSocket: () =>{
    // First check is the socket is connected only if it is connected then disconnect 
    if(get().socket?.connected){
      get().socket.disconnect();
    }
  }
}));
