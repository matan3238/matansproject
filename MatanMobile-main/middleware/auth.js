// Middleware לאימות JWT
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'matan-mobile-secret-change-in-production';

// יצירת Token
function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// אימות Token והחזרת משתמש
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'נדרשת התחברות' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.getById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'משתמש לא נמצא' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token לא תקין או פג תוקף' });
  }
}

// אימות מנהל
async function verifyAdmin(req, res, next) {
  if (!User.isAdmin(req.user)) {
    return res.status(403).json({ success: false, message: 'אין הרשאות מנהל' });
  }
  req.adminUser = req.user;
  next();
}

module.exports = {
  generateToken,
  verifyToken,
  verifyAdmin,
  JWT_SECRET
};
