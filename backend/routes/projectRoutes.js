import express from 'express';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject
} from '../controller/projectController.js';
import { auth, optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

// Public routes (with optional authentication)
router.post('/', optionalAuth, createProject); // Allow anonymous projects
router.get('/', optionalAuth, getProjects);    // List public and user's projects
router.get('/:projectSlug', optionalAuth, getProject); // Get public or user's project

// Protected routes (require authentication)
router.put('/:projectSlug', auth, updateProject);
router.delete('/:projectSlug', auth, deleteProject);

export default router;