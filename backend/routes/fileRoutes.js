import express from 'express';
import {
  createFile,
  updateFile,
  deleteFile,
  getFile
} from '../controller/fileController.js';
import { auth, optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

// Public routes (with optional authentication)
router.get('/:fileId', optionalAuth, getFile); // Allow reading public files

// Protected routes (require authentication)
router.post('/', auth, createFile);
router.put('/:fileId', auth, updateFile);
router.delete('/:fileId', auth, deleteFile);

export default router;