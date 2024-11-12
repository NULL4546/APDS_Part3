const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function hashPassword(password) {
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Function to generate JWT
const generateToken = (userId) => {
  const payload = { userId };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });  
  return token;
};

// Function to verify JWT
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    return decoded;
  } catch (error) {
    return null;
  }
};

// Export all functions
module.exports = { hashPassword, verifyPassword, generateToken, verifyToken };
