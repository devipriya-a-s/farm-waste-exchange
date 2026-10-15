const jwt = require('jsonwebtoken');

module.exports = (roleNeeded) => (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token, please login' });

  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    if (roleNeeded && req.user.role !== roleNeeded) {
      return res.status(403).json({ message: `Only ${roleNeeded}s can do this` });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};