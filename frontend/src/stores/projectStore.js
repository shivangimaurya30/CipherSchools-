import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  files: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      set({
        projects: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch projects',
        isLoading: false,
      });
    }
  },

  createProject: async (name, description = '', framework = 'react') => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/projects`,
        { 
          name, 
          description,
          framework,
          settings: {
            framework,
            autoSave: true
          }
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      set((state) => ({
        projects: [...state.projects, response.data.data],
        isLoading: false,
      }));
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create project',
        isLoading: false,
      });
      return null;
    }
  },

  fetchProject: async (projectSlug) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/projects/${projectSlug}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      set({
        currentProject: response.data.data,
        isLoading: false,
      });

      // Fetch files for the project
      const filesResponse = await axios.get(`${API_URL}/files/${response.data.data.rootFolderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      set({
        files: filesResponse.data.data,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch project',
        isLoading: false,
      });
    }
  },

  updateProject: async (projectSlug, updates) => {
    try {
      const response = await axios.put(
        `${API_URL}/projects/${projectSlug}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      set((state) => ({
        projects: state.projects.map((p) =>
          p.projectSlug === projectSlug ? response.data.data : p
        ),
        currentProject:
          state.currentProject?.projectSlug === projectSlug
            ? response.data.data
            : state.currentProject,
      }));
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update project',
      });
      return false;
    }
  },

  deleteProject: async (projectSlug) => {
    try {
      await axios.delete(`${API_URL}/projects/${projectSlug}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      set((state) => ({
        projects: state.projects.filter((p) => p.projectSlug !== projectSlug),
        currentProject:
          state.currentProject?.projectSlug === projectSlug ? null : state.currentProject,
      }));
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete project',
      });
      return false;
    }
  },

  createFile: async (projectId, parentId, name, type, content = '') => {
    try {
      const response = await axios.post(
        `${API_URL}/files`,
        { projectId, parentId, name, type, content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      set((state) => ({
        files: [...state.files, response.data.file],
      }));
      return response.data.file;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create file',
      });
      return null;
    }
  },

  updateFile: async (fileId, updates) => {
    try {
      const response = await axios.put(
        `${API_URL}/files/${fileId}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      set((state) => ({
        files: state.files.map((f) =>
          f._id === fileId ? response.data.file : f
        ),
      }));
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update file',
      });
      return false;
    }
  },

  deleteFile: async (fileId) => {
    try {
      await axios.delete(`${API_URL}/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      set((state) => ({
        files: state.files.filter((f) => f._id !== fileId),
      }));
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete file',
      });
      return false;
    }
  },
}));

export default useProjectStore;