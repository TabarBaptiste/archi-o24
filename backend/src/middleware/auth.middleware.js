const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Get the token from the request headers
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }
  
  // Check if the header has the right format (Bearer TOKEN)
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Authentication token format is invalid' });
  }
  
  const token = parts[1];
  
  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cours-angular');
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = {
  verifyToken
};
