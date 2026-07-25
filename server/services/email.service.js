import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter = null;

/**
 * Creates and returns the Nodemailer email transporter.
 * Falls back to an Ethereal test account or console logging if SMTP environment variables are missing.
 */
const getTransporter = async () => {
  if (transporter) return transporter;

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    console.log(`📧 [Email Service] Configuring live SMTP transporter via ${smtpHost}`);
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
    return transporter;
  }

  // Fallback: Create test account on Ethereal.email for out-of-the-box local testing
  try {
    console.log('📧 [Email Service] No custom SMTP configured in .env. Initializing Ethereal Test Account...');
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`✅ [Email Service] Ethereal Test Email Account created: ${testAccount.user}`);
    return transporter;
  } catch (err) {
    console.warn('⚠️ [Email Service] Could not create test email account, will log email body to console.');
    return null;
  }
};

/**
 * Sends a welcome email containing generated credentials to the newly registered student.
 * 
 * @param {object} params
 * @param {string} params.email Student's email address
 * @param {string} params.name Student's full name
 * @param {string} params.username Generated username (e.g. EP260001)
 * @param {string} params.password Generated raw password (e.g. Ex@48291)
 * @param {string} params.collegeName Registered college name
 */
export const sendWelcomeEmail = async ({ email, name, username, password, collegeName }) => {
  const loginUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const fromHeader = process.env.EMAIL_FROM || '"Form2Login Support" <no-reply@form2login.com>';

  const subject = 'Welcome to Form2Login - Student Account Credentials';

  const textBody = `
Welcome to Form2Login, ${name}!

Your account for ${collegeName} has been created successfully.

Here are your login credentials:
----------------------------------------
Username: ${username}
Password: ${password}
----------------------------------------

Login URL: ${loginUrl}

Please change your password after your first login.

Best regards,
Form2Login Support Team
  `.trim();

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: system-ui, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #0f172a; }
        .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 0px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #cbd5e1; }
        .header { background: #84cc16; color: #0f172a; padding: 25px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; }
        .content { padding: 25px; }
        .cred-box { background: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #84cc16; padding: 15px; margin: 20px 0; }
        .cred-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; }
        .cred-value { font-size: 18px; font-weight: 700; color: #0f172a; font-family: monospace; margin-bottom: 8px; }
        .btn { display: inline-block; background: #84cc16; color: #0f172a; text-decoration: none; padding: 12px 24px; font-weight: 700; border: 1px solid #65a30d; }
        .footer { background: #f1f5f9; padding: 15px; text-align: center; font-size: 11px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>Welcome to Form2Login</h1>
        </div>
        <div class="content">
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your registration for <strong>${collegeName}</strong> has been processed and your account is ready!</p>
          
          <div class="cred-box">
            <div class="cred-label">Your Username</div>
            <div class="cred-value">${username}</div>
            
            <div class="cred-label">Temporary Password</div>
            <div class="cred-value">${password}</div>
          </div>

          <p>You can access your student portal and log in immediately.</p>
          
          <div style="text-align: center;">
            <a href="${loginUrl}" class="btn">Log In to Form2Login Portal</a>
          </div>
        </div>
        <div class="footer">
          © 2026 Form2Login Inc. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  // Log credentials prominently in server logs
  console.log(`=============================================================`);
  console.log(`📩 [WELCOME EMAIL GENERATED FOR STUDENT: ${name}]`);
  console.log(`📧 Email To:  ${email}`);
  console.log(`👤 Username:  ${username}`);
  console.log(`🔑 Password:  ${'*'.repeat(password.length)} (masked)`);
  console.log(`=============================================================`);

  try {
    const mailTransporter = await getTransporter();
    if (!mailTransporter) return false;

    const info = await mailTransporter.sendMail({
      from: fromHeader,
      to: email,
      subject,
      text: textBody,
      html: htmlBody,
    });

    console.log(`✅ [Email Dispatch Success] Message ID: ${info.messageId}`);
    
    // If using Ethereal, print preview link
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`🔗 [Ethereal Email Preview URL]: ${previewUrl}`);
    }
    return true;
  } catch (error) {
    console.error('❌ [Email Dispatch Error]:', error.message);
    return false;
  }
};
