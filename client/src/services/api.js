import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 12000,
});

// Interceptor to attach JWT token to authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('form2login_jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Student Login API
 * POST /api/auth/login
 */
export const loginStudent = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      success: false,
      message: error.message || 'Network error. Could not connect to backend server.',
    };
  }
};

/**
 * Get Current Student Profile
 * GET /api/auth/me
 */
export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch current user profile.',
    };
  }
};


/**
 * List all registered students
 * GET /api/students
 */
export const fetchRegisteredStudents = async () => {
  try {
    const response = await api.get('/students');
    return response.data;
  } catch (error) {
    return {
      success: false,
      students: [],
    };
  }
};

export default api;
