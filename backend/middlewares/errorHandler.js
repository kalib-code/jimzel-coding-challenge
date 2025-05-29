/**
 * Global error handler middleware
 */
function errorHandler(err, req, res, next) {
  console.error(err.stack);

  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Handle specific error types
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: 'Duplicate entry for unique field',
      message: err.message
    });
  }
  
  if (err.code === 'ER_ROW_IS_REFERENCED') {
    return res.status(409).json({
      error: 'Cannot delete record because it is referenced by other records',
      message: err.message
    });
  }
  
  res.status(status).json({
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = errorHandler;