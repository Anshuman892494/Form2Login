import { getGoogleSheetsClient } from '../config/googleSheets.js';

// Fallback demo accounts matching prompt requirements when Google Sheets API credentials are not set up
const DEMO_USERS = [
  { username: 'anshu', password: '123456', role: 'admin', fullName: 'Anshu Kumar' },
  { username: 'rahul', password: 'password123', role: 'user', fullName: 'Rahul Sharma' },
  { username: 'admin', password: 'admin123', role: 'admin', fullName: 'System Administrator' },
];

/**
 * Fetches user accounts from Google Sheet or fallback mock store.
 * @returns {Promise<{ users: Array, source: string, error?: string }>}
 */
export const fetchUsersFromSheet = async () => {
  const sheetsClient = getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const range = process.env.GOOGLE_SHEET_RANGE || 'Sheet1!A:B';

  if (!sheetsClient || !spreadsheetId) {
    console.log('ℹ️ [Sheets Service] Using Fallback Demo Users (No Google Credentials configured).');
    return {
      users: DEMO_USERS,
      source: 'Demo Fallback (Configure .env for Live Google Sheet)',
    };
  }

  try {
    console.log(`📊 [Sheets Service] Fetching data from Google Sheet ID: ${spreadsheetId}, Range: ${range}`);
    
    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      console.warn('⚠️ [Sheets Service] Google Sheet is empty or no data found.');
      return { users: [], source: 'Google Sheets API', error: 'Spreadsheet contains no rows.' };
    }

    // Process rows (check if first row is header e.g. "Username", "Password")
    const users = [];
    let startIndex = 0;

    const firstRowCol1 = String(rows[0][0] || '').trim().toLowerCase();
    const firstRowCol2 = String(rows[0][1] || '').trim().toLowerCase();

    if (firstRowCol1 === 'username' || firstRowCol1 === 'user' || firstRowCol2 === 'password') {
      startIndex = 1; // Skip header row
    }

    for (let i = startIndex; i < rows.length; i++) {
      const row = rows[i];
      if (row && row.length >= 2) {
        const username = String(row[0] || '').trim();
        const password = String(row[1] || '').trim();
        
        if (username && password) {
          users.push({
            username,
            password,
            rowNumber: i + 1,
            role: username.toLowerCase() === 'anshu' ? 'admin' : 'user',
            fullName: username.charAt(0).toUpperCase() + username.slice(1),
          });
        }
      }
    }

    console.log(`✅ [Sheets Service] Successfully loaded ${users.length} user record(s) from Google Sheet.`);
    return { users, source: 'Live Google Sheet' };
  } catch (error) {
    console.error('❌ [Sheets Service Error] Failed to read Google Sheet:', error.message);

    // Provide friendly diagnostics
    let errorDetail = error.message;
    if (error.code === 403 || error.message.includes('permission')) {
      errorDetail = 'Permission Denied: Please share your Google Sheet with your Service Account email.';
    } else if (error.code === 404 || error.message.includes('notFound')) {
      errorDetail = 'Spreadsheet Not Found: Verify your GOOGLE_SHEET_ID in .env.';
    }

    console.log('🔄 Falling back to Demo User dataset for uninterrupted testing.');
    return {
      users: DEMO_USERS,
      source: `Demo Fallback (Google API Error: ${errorDetail})`,
      error: errorDetail,
    };
  }
};

/**
 * Validates user credentials against Google Sheet accounts.
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{ success: boolean, user?: object, message: string, source: string }>}
 */
export const authenticateUserCredentials = async (username, password) => {
  if (!username || !password) {
    return {
      success: false,
      message: 'Username and password are required',
      source: 'Validation Error',
    };
  }

  const cleanUsername = String(username).trim();
  const cleanPassword = String(password).trim();

  const { users, source } = await fetchUsersFromSheet();

  // Find user by username (case-insensitive comparison for username, exact match for password)
  const foundUser = users.find(
    (u) => u.username.toLowerCase() === cleanUsername.toLowerCase()
  );

  if (!foundUser) {
    return {
      success: false,
      message: 'Invalid username or password',
      source,
    };
  }

  // Exact password check
  if (foundUser.password !== cleanPassword) {
    return {
      success: false,
      message: 'Invalid username or password',
      source,
    };
  }

  // Credentials are valid
  const userPayload = {
    username: foundUser.username,
    fullName: foundUser.fullName || foundUser.username,
    role: foundUser.role || 'user',
    authenticatedAt: new Date().toISOString(),
  };

  return {
    success: true,
    message: 'Login successful',
    user: userPayload,
    source,
  };
};
