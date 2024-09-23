import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // Check if token is provided
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token not provided', success: false });
    }

    // Extract token from Bearer <token>
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token', success: false });
    }

    // Set user info for further requests
    req.id = decoded.userID;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed', success: false });
  }
};

export default isAuthenticated;
