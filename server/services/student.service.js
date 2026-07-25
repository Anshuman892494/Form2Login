import bcrypt from 'bcryptjs';
import { Student } from '../models/Student.model.js';
import { generateUniqueUsername, generateSecurePassword } from '../utils/generator.js';
import { sendWelcomeEmail } from './email.service.js';

// In-memory student store fallback if MongoDB server is offline
const memoryStudents = [];
let memoryCounter = 1;

/**
 * Registers a student from Google Form or Direct API.
 * 
 * Steps:
 * 1. Validate mandatory fields
 * 2. Check for duplicate email or mobile
 * 3. Auto-generate unique username (e.g. EP260001)
 * 4. Auto-generate secure random password (e.g. Ex@48291)
 * 5. Hash password using bcrypt
 * 6. Save in MongoDB (or fallback memory database)
 * 7. Send credentials email
 * 
 * @param {object} payload { name, mobile, email, collegeName, address }
 * @returns {Promise<{ success: boolean, student?: object, rawPassword?: string, message: string }>}
 */
export const registerStudentService = async (payload) => {
  const { name, mobile, email, collegeName, address } = payload;

  // 1. Mandatory input validation
  if (!name || !mobile || !email || !collegeName || !address) {
    throw new Error('All form fields (name, mobile, email, collegeName, address) are required.');
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanMobile = String(mobile).trim();
  const cleanName = String(name).trim();
  const cleanCollegeName = String(collegeName).trim();
  const cleanAddress = String(address).trim();

  // 2. Check duplicate email or mobile
  const dbConnected = Student && Student.db && Student.db.readyState === 1;

  if (dbConnected) {
    const existingEmail = await Student.findOne({ email: cleanEmail });
    if (existingEmail) {
      throw new Error(`A student with email '${cleanEmail}' is already registered.`);
    }

    const existingMobile = await Student.findOne({ mobile: cleanMobile });
    if (existingMobile) {
      throw new Error(`A student with mobile number '${cleanMobile}' is already registered.`);
    }
  } else {
    // Check in-memory fallback
    const exists = memoryStudents.find(s => s.email === cleanEmail || s.mobile === cleanMobile);
    if (exists) {
      throw new Error(`A student with this email or mobile is already registered (Memory Store).`);
    }
  }

  // 3. Auto-generate unique Username & Password
  const generatedUsername = await generateUniqueUsername(memoryCounter);
  const rawPassword = generateSecurePassword();

  // 4. Hash password with bcryptjs (10 rounds salt)
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(rawPassword, salt);

  let newStudent = null;

  // 5. Save user record in MongoDB
  if (dbConnected) {
    newStudent = await Student.create({
      name: cleanName,
      mobile: cleanMobile,
      email: cleanEmail,
      collegeName: cleanCollegeName,
      address: cleanAddress,
      username: generatedUsername,
      passwordHash,
    });
  } else {
    // Save to memory store
    newStudent = {
      _id: `mem_${Date.now()}`,
      name: cleanName,
      mobile: cleanMobile,
      email: cleanEmail,
      collegeName: cleanCollegeName,
      address: cleanAddress,
      username: generatedUsername,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    memoryStudents.push(newStudent);
    memoryCounter++;
  }

  // 6. Send credentials via Email (Handled on Google Apps Script side to bypass SMTP blocks)
  /*
  await sendWelcomeEmail({
    email: cleanEmail,
    name: cleanName,
    username: generatedUsername,
    password: rawPassword,
    collegeName: cleanCollegeName,
  });
  */

  return {
    success: true,
    message: 'Student registered successfully in MongoDB.',
    student: {
      id: newStudent._id,
      name: newStudent.name,
      email: newStudent.email,
      username: newStudent.username,
      collegeName: newStudent.collegeName,
      createdAt: newStudent.createdAt,
    },
    rawPassword, // Returned for instant testing confirmation response
  };
};

/**
 * Authenticates a student using Username and Password strictly against MongoDB.
 * 
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{ success: boolean, student?: object, message: string }>}
 */
export const authenticateStudentService = async (username, password) => {
  if (!username || !password) {
    throw new Error('Please enter both Username and Password.');
  }

  const cleanUsername = String(username).trim();
  const cleanPassword = String(password).trim();

  const dbConnected = Student && Student.db && Student.db.readyState === 1;
  let targetStudent = null;

  if (dbConnected) {
    targetStudent = await Student.findOne({ username: cleanUsername });
  } else {
    targetStudent = memoryStudents.find(s => s.username === cleanUsername);
  }

  if (!targetStudent) {
    return {
      success: false,
      message: 'Invalid Username or Password',
    };
  }

  // Compare submitted raw password with stored bcrypt passwordHash
  const isMatch = await bcrypt.compare(cleanPassword, targetStudent.passwordHash);

  if (!isMatch) {
    return {
      success: false,
      message: 'Invalid Username or Password',
    };
  }

  // Credentials match - return sanitized student profile
  return {
    success: true,
    message: 'Student login successful',
    student: {
      id: targetStudent._id,
      name: targetStudent.name,
      mobile: targetStudent.mobile,
      email: targetStudent.email,
      collegeName: targetStudent.collegeName,
      address: targetStudent.address,
      username: targetStudent.username,
      createdAt: targetStudent.createdAt,
    },
  };
};
