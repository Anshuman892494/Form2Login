import express from 'express';
import {
  studentLoginController,
  studentLogoutController,
  getCurrentStudentController,
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Student Login: POST /api/auth/login
router.post('/login', studentLoginController);

// Student Logout: POST /api/auth/logout
router.post('/logout', studentLogoutController);

// Get Current Logged-in Student: GET /api/auth/me
router.get('/me', protectRoute, getCurrentStudentController);

export default router;
