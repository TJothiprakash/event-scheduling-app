const jwt = require('jsonwebtoken');

const checkAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(403).json({ msg: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = checkAdmin;
