import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Configure axios to include credentials
axios.defaults.withCredentials = true;

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  success: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });
      const { success, message, user } = response.data;
      if (success) {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          success: message,
        });
        return true;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
        success: null,
      });
      return false;
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        username,
        email,
        password,
      });
      const { success, message, user } = response.data;
      if (success) {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          success: message,
        });
        return true;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false,
        success: null,
      });
      return false;
    }
  },

  logout: async () => {
    try {
      const response = await axios.post(`${API_URL}/users/logout`);
      const { success, message } = response.data;
      if (success) {
        set({
          user: null,
          isAuthenticated: false,
          success: message,
        });
        return true;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Logout failed',
        success: null,
      });
      return false;
    }
  },

  checkAuth: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/profile`);
      const { success, user } = response.data;
      if (success) {
        set({
          user,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },

  updateSettings: async (settings) => {
    try {
      const response = await axios.put(`${API_URL}/users/settings`, settings);
      const { success, message, settings: updatedSettings } = response.data;
      if (success) {
        set((state) => ({
          user: {
            ...state.user,
            settings: updatedSettings,
          },
          success: message,
        }));
        return true;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update settings',
        success: null,
      });
      return false;
    }
  },

  clearMessages: () => {
    set({
      error: null,
      success: null,
    });
  },
}));

export default useAuthStore;