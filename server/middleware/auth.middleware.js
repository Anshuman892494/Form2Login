import jwt from 'jsonwebtoken';
import { Student } from '../models/Student.model.js';

/**
 * Protect routes using JWT header Authorization: Bearer <token>
 */
export const protectRoute = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'form2login_jwt_super_secret_key_2026';
      
      const decoded = jwt.verify(token, secret);

      const dbConnected = Student && Student.db && Student.db.readyState === 1;

      if (dbConnected) {
        req.student = await Student.findById(decoded.id).select('-passwordHash');
      } else {
        req.student = {
          id: decoded.id,
          username: decoded.username,
          email: decoded.email,
        };
      }

      return next();
    } catch (error) {
      console.error('❌ [JWT Middleware Error]:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid or expired',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};
