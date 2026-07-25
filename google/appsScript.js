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
const BACKEND_WEBHOOK_URL = "https://form2login-student-register.loca.lt/api/students/google-register";

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
     * Column 2: Father's Name
     * Column 3: Mobile Number
     * Column 4: Email Address
     * Column 5: Course
     * Column 6: Address
     */
    var payload = {
      name: rowData[1] || "",
      fatherName: rowData[2] || "",
      mobile: String(rowData[3] || "").trim(),
      email: rowData[4] || "",
      course: rowData[5] || "",
      address: rowData[6] || ""
    };

    Logger.log("Sending payload to backend: " + JSON.stringify(payload));

    var options = {
      method: "post",
      contentType: "application/json",
      headers: {
        "bypass-tunnel-reminder": "true",
        "Bypass-Tunnel-Reminder": "true"
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(BACKEND_WEBHOOK_URL, options);
    var responseText = response.getContentText();
    
    Logger.log("Backend Response Code: " + response.getResponseCode());
    Logger.log("Backend Response Body: " + responseText);

  } catch (error) {
    Logger.log("Error in onFormSubmit: " + error.toString());
  }
}
