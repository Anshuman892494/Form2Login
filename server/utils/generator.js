import { Student } from '../models/Student.model.js';

/**
 * Generates a unique sequential Username in the format: EP260001, EP260002, etc.
 * @returns {Promise<string>} Unique generated username
 */
export const generateUniqueUsername = async (fallbackCount = 1) => {
  const prefix = 'EP26';

  try {
    // Search DB for the highest existing username matching 'EP26*'
    if (Student && Student.db && Student.db.readyState === 1) {
      const highestUser = await Student.findOne({ username: { $regex: '^EP26' } })
        .sort({ username: -1 })
        .exec();

      if (highestUser && highestUser.username) {
        const numericPart = parseInt(highestUser.username.replace('EP26', ''), 10);
        if (!isNaN(numericPart)) {
          const nextNumber = numericPart + 1;
          return `${prefix}${String(nextNumber).padStart(4, '0')}`;
        }
      }
    }
  } catch (err) {
    console.warn('⚠️ Could not query MongoDB for latest username prefix, using timestamp counter.');
  }

  // Fallback sequential index / timestamp counter
  const paddedIndex = String(fallbackCount).padStart(4, '0');
  return `${prefix}${paddedIndex}`;
};

/**
 * Generates a secure random password (8-12 characters) with:
 * - At least 1 Uppercase character
 * - At least 1 Lowercase character
 * - At least 1 Number
 * - At least 1 Special character (@#$%&*!?)
 * 
 * Example output: Ex@48291
 * @returns {string} Random password
 */
export const generateSecurePassword = () => {
  const uppers = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowers = 'abcdefghijkmnpqrstuvwxyz';
  const numbers = '23456789';
  const specials = '@#$%&*!?';

  const allChars = uppers + lowers + numbers + specials;

  // Pick guaranteed required characters
  const reqUpper = uppers.charAt(Math.floor(Math.random() * uppers.length));
  const reqLower = lowers.charAt(Math.floor(Math.random() * lowers.length));
  const reqNumber = numbers.charAt(Math.floor(Math.random() * numbers.length));
  const reqSpecial = specials.charAt(Math.floor(Math.random() * specials.length));

  // Determine total length between 8 and 10 characters
  const totalLength = 9;

  let passwordChars = [reqUpper, reqLower, reqNumber, reqSpecial];

  for (let i = passwordChars.length; i < totalLength; i++) {
    const randomChar = allChars.charAt(Math.floor(Math.random() * allChars.length));
    passwordChars.push(randomChar);
  }

  // Shuffle character array using Fisher-Yates algorithm
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  return passwordChars.join('');
};
