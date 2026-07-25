import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initializes and returns the Google Sheets API client.
 * Uses Google Service Account credentials from environment variables or service account JSON file.
 * Returns null if credentials are not configured (enables mock/demo mode).
 */
export const getGoogleSheetsClient = () => {
  try {
    const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

    // Method 1: Using JSON Key File if specified & exists
    const keyFilePath = process.env.GOOGLE_SERVICE_ACCOUNT_FILE_PATH;
    if (keyFilePath && fs.existsSync(path.resolve(keyFilePath))) {
      console.log('🔑 [GoogleSheets Config] Loading authentication via Service Account JSON file...');
      const auth = new google.auth.GoogleAuth({
        keyFile: path.resolve(keyFilePath),
        scopes,
      });
      return google.sheets({ version: 'v4', auth });
    }

    // Method 2: Using Inline Environment Variables
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (clientEmail && privateKey) {
      console.log('🔑 [GoogleSheets Config] Loading authentication via Environment Variables...');
      
      // Format private key correctly (handling escaped \n characters)
      privateKey = privateKey.replace(/\\n/g, '\n');

      const auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes,
      });

      return google.sheets({ version: 'v4', auth });
    }

    console.warn('⚠️ [GoogleSheets Config] Google Service Account credentials missing in .env');
    console.warn('💡 [GoogleSheets Config] System running in fallback Demo Sheet mode.');
    return null;
  } catch (error) {
    console.error('❌ [GoogleSheets Config Error]:', error.message);
    return null;
  }
};
