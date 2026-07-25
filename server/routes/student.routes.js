import express from 'express';
import {
  googleRegisterController,
  directRegisterController,
  listStudentsController,
} from '../controllers/student.controller.js';

const router = express.Router();

// Webhook for Google Apps Script trigger: POST /api/students/google-register
router.post('/google-register', googleRegisterController);

// Direct web registration: POST /api/students/register
router.post('/register', directRegisterController);

// List all registered students: GET /api/students
router.get('/', listStudentsController);

export default router;
