# Google Form to MongoDB Auto Registration System (MERN Stack)

A complete production-ready MERN Stack application that automatically processes **Google Form submissions** via **Google Apps Script**, generates unique student usernames (`EP260001`) and secure passwords (`Ex@48291`), hashes passwords using `bcryptjs`, stores student records in **MongoDB**, sends welcome emails with credentials via `nodemailer`, and provides JWT student authentication.

![MERN System Architecture](https://img.shields.io/badge/Architecture-Google%20Form%20%E2%9E%94%20MongoDB%20%E2%9E%94%20JWT-0284c7?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)

---

## 🔄 Workflow Diagram

```
[Student Submits Google Form]
          │
          ▼
[Google Sheet (Automatic)]
          │
          ▼
[Google Apps Script (onFormSubmit Trigger)]
          │  POST /api/students/google-register
          ▼
[Express Backend]
  ├── 1. Validate fields (Name, Father's Name, Mobile, Email, Course, Address)
  ├── 2. Check for duplicate Email or Mobile in MongoDB
  ├── 3. Auto-generate unique Username (e.g., EP260001)
  ├── 4. Auto-generate secure random Password (e.g., Ex@48291)
  ├── 5. Hash password with bcryptjs
  ├── 6. Save Student document in MongoDB
  └── 7. Send Welcome Email via Nodemailer (credentials & login URL)
          │
          ▼
[Student Receives Credentials via Email]
          │
          ▼
[React Frontend Login Page] ──(POST /api/auth/login)──► [MongoDB Authentication]
          │                                                       │
   Submit Username & Password                               Validates bcrypt hash
          │                                                       │
          └─────────── Returns JWT & Student Profile ──────────────┘
```

---

## 📋 Google Form Fields Mapping

Ensure your Google Form contains the following 6 fields:

1. **Full Name** (`name`)
2. **Father's Name** (`fatherName`)
3. **Mobile Number** (`mobile`)
4. **Email Address** (`email`)
5. **Course** (`course`)
6. **Address** (`address`)

---

## 🛠️ Tech Stack & Key Features

* **Backend**: Node.js, Express.js, MongoDB (Mongoose ORM), `bcryptjs`, `jsonwebtoken` (JWT), `nodemailer`, `express-validator`, `dotenv`.
* **Frontend**: React.js (Vite bundle), Tailwind CSS, Lucide icons, Axios with JWT authorization interceptors.
* **Username Generation**: Auto-generates unique sequential IDs (`EP260001`, `EP260002`, ...).
* **Password Generation**: Auto-generates strong passwords (8-12 chars containing uppercase, lowercase, numbers, and special characters e.g. `Ex@48291`).
* **Email Service**: Dispatches welcome email with credentials & login URL. Features auto Ethereal test account / console logger for 100% out-of-the-box local testing.
* **MongoDB Authentication**: Student login verifies credentials strictly with MongoDB via `bcrypt.compare()`.

---

## 🚀 Quick Start Guide

### 1. Install All Dependencies
From the project root folder, execute:

```bash
npm run setup
```

*(This automatically runs `npm install` in root, `server/`, and `client/`).*

---

### 2. Configure Environment Variables (`server/.env`)

Ensure `server/.env` is configured:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/form2login_db
JWT_SECRET=form2login_jwt_super_secret_key_2026
CLIENT_URL=http://localhost:3000

# Optional: Nodemailer SMTP Credentials (Leave blank to use auto Ethereal test account / console logger)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM="Form2Login Support <no-reply@form2login.com>"
```

---

### 3. Start Development Servers

Run the concurrent server and client script:

```bash
npm run dev
```

* **React Frontend**: [http://localhost:3000](http://localhost:3000)
* **Express Backend**: [http://localhost:5000](http://localhost:5000)

---

## 📜 Google Apps Script Setup Instructions

To link your Google Form automatically to the Express backend:

1. Open the **Google Sheet** linked to your Google Form.
2. In the top navigation bar, select **Extensions** ➔ **Apps Script**.
3. Clear any existing text and paste the content from [`google/appsScript.js`](file:///c:/Users/anshu/OneDrive/Desktop/DataFetch/google/appsScript.js).
4. Update `BACKEND_WEBHOOK_URL`:
   - For local development with ngrok: `"https://xxxx.ngrok-free.app/api/students/google-register"`
   - For deployed server: `"https://your-domain.com/api/students/google-register"`
5. Click **Save** (Ctrl + S / Cmd + S).
6. On the left sidebar, click the **Triggers** icon (clock) ➔ **Add Trigger**:
   - Choose which function to run: `onFormSubmit`
   - Select event source: `From spreadsheet`
   - Select event type: `On form submit`
7. Click **Save** and grant permissions.

---

## 📡 API Endpoint Reference

### 1. Google Form Registration Webhook
* **Method**: `POST`
* **URL**: `/api/students/google-register`
* **Content-Type**: `application/json`
* **Request Body**:
  ```json
  {
    "name": "Anshu Verma",
    "fatherName": "Ram Verma",
    "mobile": "9876543210",
    "email": "anshu@example.com",
    "course": "CCC",
    "address": "Lucknow"
  }
  ```
* **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Student registered successfully in MongoDB and email sent.",
    "student": {
      "id": "6602e1...",
      "name": "Anshu Verma",
      "email": "anshu@example.com",
      "username": "EP260001",
      "course": "CCC"
    },
    "generatedCredentials": {
      "username": "EP260001",
      "password": "Ex@48291"
    }
  }
  ```

---

### 2. Student Authentication (MongoDB)
* **Method**: `POST`
* **URL**: `/api/auth/login`
* **Content-Type**: `application/json`
* **Request Body**:
  ```json
  {
    "username": "EP260001",
    "password": "Ex@48291"
  }
  ```
* **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "student": {
      "id": "6602e1...",
      "name": "Anshu Verma",
      "username": "EP260001",
      "course": "CCC"
    }
  }
  ```
* **Response `401 Unauthorized`**:
  ```json
  {
    "success": false,
    "message": "Invalid Username or Password"
  }
  ```

---

### 3. Get Current Student Profile
* **Method**: `GET`
* **URL**: `/api/auth/me`
* **Header**: `Authorization: Bearer <JWT_TOKEN>`
* **Response `200 OK`**: Returns authenticated student profile.

---

## 🔒 Security Best Practices Implemented

1. **Password Encryption**: Passwords are never stored as plain text. Generated passwords are encrypted with `bcryptjs` (10 salt rounds) prior to storage.
2. **MongoDB Isolation**: Authentication verifies credentials strictly against MongoDB. Google Sheets is never accessed during login.
3. **Duplicate Protection**: Unique indexes on `email`, `mobile`, and `username` prevent duplicate account creation.
4. **Input Sanitization**: Request bodies are cleaned and validated to prevent injection vulnerabilities.
