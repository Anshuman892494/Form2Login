import jwt from 'jsonwebtoken';
import { authenticateStudentService } from '../services/student.service.js';

/**
 * Student Login endpoint.
 * Endpoint: POST /api/auth/login
 * Body: { username: string, password: string }
 */
export const studentLoginController = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both Username and Password.',
      });
    }

    const authResult = await authenticateStudentService(username, password);

    if (!authResult.success) {
      // 401 Unauthorized for credential mismatch
      return res.status(401).json({
        success: false,
        message: authResult.message || 'Invalid Username or Password',
      });
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not set in environment variables.');
    const token = jwt.sign(
      {
        id: authResult.student.id,
        username: authResult.student.username,
        email: authResult.student.email,
      },
      secret,
      { expiresIn: '7d' }
    );

    // 200 OK with JWT token and student profile
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      student: authResult.student,
    });
  } catch (error) {
    console.error('❌ [Student Login Controller Error]:', error);
    next(error);
  }
};

/**
 * Logout endpoint.
 * Endpoint: POST /api/auth/logout
 */
export const studentLogoutController = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

/**
 * Get current authenticated student details.
 * Endpoint: GET /api/auth/me
 */
export const getCurrentStudentController = async (req, res) => {
  if (!req.student) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized',
    });
  }

  return res.status(200).json({
    success: true,
    student: req.student,
  });
};
