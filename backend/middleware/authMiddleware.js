import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

export async function protect(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized: No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Not authorized: User no longer exists' });
    }

    // Strip sensitive fields before attaching to req
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized: Invalid or expired token' });
  }
}

export default { protect };
