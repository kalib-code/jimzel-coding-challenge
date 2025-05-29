/**
 * Client info middleware to add client IP and user info to request
 */
function clientInfo(req, res, next) {
  // Get client IP
  req.clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  // Default user if not provided
  req.user = req.headers['x-user'] || 'system';
  
  next();
}

module.exports = clientInfo;