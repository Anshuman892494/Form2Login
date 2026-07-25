import React, { useState } from 'react';
import { Code2, Copy, Check, ExternalLink, ShieldAlert, Sparkles, Send } from 'lucide-react';

const APPS_SCRIPT_CODE = `/**
 * Google Apps Script for Google Form -> Express Backend Auto Registration
 * Trigger: On form submit
 */

const BACKEND_WEBHOOK_URL = "https://form2login-server.onrender.com/api/students/google-register";

function onFormSubmit(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var lastRow = sheet.getLastRow();
    var rowData = (e && e.values) ? e.values : sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    var payload = {
      name: rowData[1] || "",
      mobile: String(rowData[2] || "").trim(),
      email: rowData[3] || "",
      collegeName: rowData[4] || "",
      address: rowData[5] || ""
    };

    var options = {
      method: "post",
      contentType: "application/json",
      headers: {
        "x-webhook-secret": "YOUR_WEBHOOK_SECRET_HERE"
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(BACKEND_WEBHOOK_URL, options);
    var responseText = response.getContentText();
    var responseCode = response.getResponseCode();
    Logger.log("Backend Response: " + responseText);

    if (responseCode === 201 || responseCode === 200) {
      var resData = JSON.parse(responseText);
      if (resData.success && resData.generatedCredentials) {
        var username = resData.generatedCredentials.username;
        var password = resData.generatedCredentials.password;
        var loginUrl = BACKEND_WEBHOOK_URL.split("/api/")[0];
        
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
          '      <p>Hello <strong>\' + payload.name + \'</strong>,</p>' +
          '      <p>Your registration for <strong>\' + payload.collegeName + \'</strong> has been processed and your account is ready!</p>' +
          '      ' +
          '      <div class="cred-box">' +
          '        <div class="cred-label">Your Username</div>' +
          '        <div class="cred-value">\' + username + \'</div>' +
          '        ' +
          '        <div class="cred-label">Temporary Password</div>' +
          '        <div class="cred-value">\' + password + \'</div>' +
          '      </div>' +
          '      <p>You can access your student portal and log in immediately.</p>' +
          '      ' +
          '      <div style="text-align: center;">' +
          '        <a href="\' + loginUrl + \'" class="btn">Log In to Form2Login Portal</a>' +
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
      }
    }
  } catch (error) {
    Logger.log("Error: " + error.toString());
  }
}`;

export const AppsScriptGuide = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div className="glass-panel rounded-3xl p-8 relative">
        <div className="flex items-center gap-3 text-indigo-400 font-bold text-sm mb-2">
          <Code2 className="w-5 h-5" />
          <span>Google Integration Guide</span>
        </div>
        <h2 className="text-2xl font-black text-slate-100">Connecting Google Form to Backend</h2>
        <p className="text-xs text-slate-400 mt-1">
          Follow these 4 simple steps to automatically register students in MongoDB when a Google Form is submitted.
        </p>
      </div>

      {/* Steps List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Step 1 */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-xs mb-3">
            1
          </div>
          <h3 className="text-sm font-bold text-slate-200">Open Linked Google Sheet</h3>
          <p className="text-xs text-slate-400 mt-1">
            Open the Google Sheet that collects your Google Form responses. Click <strong>Extensions</strong> ➔ <strong>Apps Script</strong>.
          </p>
        </div>

        {/* Step 2 */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs mb-3">
            2
          </div>
          <h3 className="text-sm font-bold text-slate-200">Paste Script Code</h3>
          <p className="text-xs text-slate-400 mt-1">
            Delete existing code and paste the Google Apps Script provided below. Update <code>BACKEND_WEBHOOK_URL</code> if using ngrok or live URL.
          </p>
        </div>

        {/* Step 3 */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs mb-3">
            3
          </div>
          <h3 className="text-sm font-bold text-slate-200">Add Trigger</h3>
          <p className="text-xs text-slate-400 mt-1">
            Click the <strong>Triggers</strong> icon (clock) on left sidebar ➔ <strong>Add Trigger</strong>. Set event type to <strong>On form submit</strong>.
          </p>
        </div>

        {/* Step 4 */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs mb-3">
            4
          </div>
          <h3 className="text-sm font-bold text-slate-200">Test Form Submission</h3>
          <p className="text-xs text-slate-400 mt-1">
            Submit your Google Form. MongoDB will automatically store student details and email credentials!
          </p>
        </div>

      </div>

      {/* Code Snippet Container */}
      <div className="glass-panel rounded-3xl p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            google/appsScript.js
          </div>
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 border border-slate-700 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Code!' : 'Copy Script Code'}</span>
          </button>
        </div>

        <pre className="bg-slate-950 p-4 rounded-2xl text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800 max-h-72">
          {APPS_SCRIPT_CODE}
        </pre>
      </div>

    </div>
  );
};

export default AppsScriptGuide;
