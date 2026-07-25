import { registerStudentService } from '../services/student.service.js';
import { Student } from '../models/Student.model.js';

/**
 * Handle Google Form submission webhook.
 * Endpoint: POST /api/students/google-register
 */
export const googleRegisterController = async (req, res, next) => {
  try {
    console.log('📩 [Google Form Webhook Triggered] Payload:', req.body);

    const result = await registerStudentService(req.body);

    return res.status(201).json({
      success: true,
      message: result.message,
      student: result.student,
      generatedCredentials: {
        username: result.student.username,
        password: result.rawPassword,
      },
    });
  } catch (error) {
    console.error('❌ [Google Registration Controller Error]:', error.message);
    return res.status(400).json({
      success: false,
      message: error.message || 'Google Form registration failed.',
    });
  }
};

/**
 * Direct web registration endpoint.
 * Endpoint: POST /api/students/register
 */
export const directRegisterController = async (req, res, next) => {
  try {
    const result = await registerStudentService(req.body);

    return res.status(201).json({
      success: true,
      message: result.message,
      student: result.student,
      generatedCredentials: {
        username: result.student.username,
        password: result.rawPassword,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Student registration failed.',
    });
  }
};

/**
 * List registered students.
 * Endpoint: GET /api/students
 */
export const listStudentsController = async (req, res, next) => {
  try {
    const dbConnected = Student && Student.db && Student.db.readyState === 1;
    let students = [];

    if (dbConnected) {
      students = await Student.find({}).sort({ createdAt: -1 }).select('-passwordHash');
    }

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    next(error);
  }
};
