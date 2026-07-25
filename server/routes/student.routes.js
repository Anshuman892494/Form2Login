import express from 'express';
import {
  googleRegisterController,
  listStudentsController,
} from '../controllers/student.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Webhook for Google Apps Script trigger: POST /api/students/google-register
router.post('/google-register', googleRegisterController);

// List all registered students (Protected): GET /api/students
router.get('/', protectRoute, listStudentsController);

export default router;
