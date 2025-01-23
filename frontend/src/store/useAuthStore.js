import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false, // Fixed typo from idUpdatingProfile to isUpdatingProfile
  isCheckingAuth: true,

  // Function to check authentication status
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.error("Error in check auth", error);
      set({ authUser: null });
      toast.error("Failed to verify authentication status. Please log in.");
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Function to sign up a new user
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create account";
      toast.error(errorMessage);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Function to log in a user
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to log in. Try again.";
      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Function to log out a user
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      toast.success("Logged out successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to log out.";
      toast.error(errorMessage);
    } finally {
      set({ authUser: null }); // Ensure the user is logged out in the store
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
