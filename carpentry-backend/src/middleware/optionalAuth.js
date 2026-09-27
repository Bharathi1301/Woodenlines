const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Attaches req.user when a valid token is present, but never blocks the request.
// Public list endpoints use it to show drafts/unapproved items to logged-in admins.
const optionalAuth = async (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return next();
  try {
    const payload = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    req.user = await User.findById(payload.sub);
  } catch {
    // Ignore bad tokens here — the request continues as an anonymous visitor.
  }
  next();
};

module.exports = optionalAuth;
