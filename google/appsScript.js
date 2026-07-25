/**
 * Google Apps Script for Google Form -> Express Backend Auto Registration
 * 
 * Instructions:
 * 1. Open the Google Sheet linked to your Google Form.
 * 2. In the top menu, go to Extension -> Apps Script.
 * 3. Delete any default code and paste this entire file.
 * 4. Update BACKEND_WEBHOOK_URL with your deployed server URL or ngrok URL.
 * 5. Save the project (Ctrl + S / Cmd + S).
 * 6. Go to Triggers (clock icon on left sidebar) -> Add Trigger:
 *    - Select function: onFormSubmit
 *    - Select event source: From spreadsheet
 *    - Select event type: On form submit
 * 7. Click Save and grant necessary permissions.
 */

// PERMANENT FIXED WEBHOOK URL (Does not change on restart)
const BACKEND_WEBHOOK_URL = "https://form2login-server.onrender.com/api/students/google-register";

/**
 * Triggered automatically when a student submits the Google Form.
 */
function onFormSubmit(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var lastRow = sheet.getLastRow();

    // If trigger event parameter exists, use e.values, else read last row from active sheet
    var rowData = (e && e.values) ? e.values : sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];

    Logger.log("Raw Form Submission Row: " + JSON.stringify(rowData));

    /**
     * Standard Google Form Row Mapping:
     * Column 0: Timestamp
     * Column 1: Full Name
     * Column 2: Mobile Number
     * Column 3: Email Address
     * Column 4: College Name
     * Column 5: Address
     */
    var payload = {
      name: rowData[1] || "",
      mobile: String(rowData[2] || "").trim(),
      email: rowData[3] || "",
      collegeName: rowData[4] || "",
      address: rowData[5] || ""
    };

    Logger.log("Sending payload to backend: " + JSON.stringify(payload));

    var options = {
      method: "post",
      contentType: "application/json",
      headers: {
        "bypass-tunnel-reminder": "true",
        "Bypass-Tunnel-Reminder": "true",
        "x-webhook-secret": "YOUR_WEBHOOK_SECRET_KEY_HERE"
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(BACKEND_WEBHOOK_URL, options);
    var responseText = response.getContentText();
    var responseCode = response.getResponseCode();
    
    Logger.log("Backend Response Code: " + responseCode);
    Logger.log("Backend Response Body: " + responseText);

    if (responseCode === 201 || responseCode === 200) {
      var resData = JSON.parse(responseText);
      if (resData.success && resData.generatedCredentials) {
        var username = resData.generatedCredentials.username;
        var password = resData.generatedCredentials.password;
        var loginUrl = BACKEND_WEBHOOK_URL.split("/api/")[0];
        
        Logger.log("📧 Sending credentials welcome email to " + payload.email + "...");
        
        var subject = "Welcome to Form2Login - Student Account Credentials";
        var htmlBody = 
          '<!DOCTYPE html>' +
          '<html>' +
          '<head>' +
          '  <style>' +
          '    body { font-family: system-ui, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #0f172a; }' +
          '    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 0px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #cbd5e1; }' +
          '    .header { background: #84cc16; color: #0f172a; padding: 25px; text-align: center; }' +
          '    .header h1 { margin: 0; font-size: 22px; font-weight: 800; }' +
          '    .content { padding: 25px; }' +
          '    .cred-box { background: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #84cc16; padding: 15px; margin: 20px 0; }' +
          '    .cred-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; }' +
          '    .cred-value { font-size: 18px; font-weight: 700; color: #0f172a; font-family: monospace; margin-bottom: 8px; }' +
          '    .btn { display: inline-block; background: #84cc16; color: #0f172a; text-decoration: none; padding: 12px 24px; font-weight: 700; border: 1px solid #65a30d; }' +
          '    .footer { background: #f1f5f9; padding: 15px; text-align: center; font-size: 11px; color: #64748b; }' +
          '  </style>' +
          '</head>' +
          '<body>' +
          '  <div class="card">' +
          '    <div class="header">' +
          '      <h1>Welcome to Form2Login</h1>' +
          '    </div>' +
          '    <div class="content">' +
          '      <p>Hello <strong>' + payload.name + '</strong>,</p>' +
          '      <p>Your registration for <strong>' + payload.collegeName + '</strong> has been processed and your account is ready!</p>' +
          '      ' +
          '      <div class="cred-box">' +
          '        <div class="cred-label">Your Username</div>' +
          '        <div class="cred-value">' + username + '</div>' +
          '        ' +
          '        <div class="cred-label">Temporary Password</div>' +
          '        <div class="cred-value">' + password + '</div>' +
          '      </div>' +
          '      <p>You can access your student portal and log in immediately.</p>' +
          '      ' +
          '      <div style="text-align: center;">' +
          '        <a href="' + loginUrl + '" class="btn">Log In to Form2Login Portal</a>' +
          '      </div>' +
          '    </div>' +
          '    <div class="footer">' +
          '      © 2026 Form2Login Inc. All rights reserved.' +
          '    </div>' +
          '  </div>' +
          '</body>' +
          '</html>';

        MailApp.sendEmail({
          to: payload.email,
          subject: subject,
          htmlBody: htmlBody
        });
        
        Logger.log("✅ Credentials email sent successfully to " + payload.email);
      }
    }

  } catch (error) {
    Logger.log("Error in onFormSubmit: " + error.toString());
  }
}
