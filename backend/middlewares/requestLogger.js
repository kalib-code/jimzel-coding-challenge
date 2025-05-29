/**
 * Request logger middleware
 */
function requestLogger(req, res, next) {
  const start = new Date();
  
  // Log when response finishes
  res.on('finish', () => {
    const duration = new Date() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });
  
  next();
}

module.exports = requestLogger;