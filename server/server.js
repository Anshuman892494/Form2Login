import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import studentRoutes from './routes/student.routes.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parsing
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/students', studentRoutes);
app.use('/api/auth', authRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    service: 'Student Portal Auto Registration System',
    status: 'Active',
    time: new Date().toISOString(),
  });
});

// Production Static Serving
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
    if (err) {
      res.json({
        service: 'Student Portal Backend API',
        webhookEndpoint: 'POST /api/students/google-register',
        loginEndpoint: 'POST /api/auth/login',
        status: 'Active',
      });
    }
  });
});

// 404 & Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Connect DB & Start Server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`=============================================================`);
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📩 Webhook URL: /api/students/google-register`);
    console.log(`🔑 Login URL:   /api/auth/login`);
    console.log(`=============================================================`);
  });
};

startServer();
