/**
 * Global Error Handling Middleware for Express Backend.
 */
export const errorHandler = (err, req, res, next) => {
  console.error('💥 [Server Unhandled Error]:', err);

  const statusCode = err.statusCode || res.statusCode !== 200 ? res.statusCode : 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

/**
 * 404 Route Not Found Middleware.
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found - [${req.method}] ${req.originalUrl}`,
  });
};
