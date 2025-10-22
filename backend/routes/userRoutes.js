import express from 'express';
import { register, login, updateSettings, getProfile, logout } from '../controller/userController.js';
import {auth} from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', auth, logout);

// Protected routes
router.put('/settings', auth, updateSettings);
router.get('/profile', auth, getProfile);

export default router; 