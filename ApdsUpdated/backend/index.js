// Required modules
const https = require('https');
const fs = require('fs');

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const { validateUsername, validatePassword } = require('./validation');
const { generateToken, verifyToken } = require('./Utils/authUtils');
const authenticateToken = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Load SSL certificate and key
const privateKey = fs.readFileSync('./keys/private-key.pem', 'utf8');
const certificate = fs.readFileSync('./keys/certificate.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// MongoDB connection
console.log("Attempting to connect to MongoDB...");
mongoose.connect('mongodb+srv://dbUser1:XbCYdGiwojecrDEM@cluster0.yemzrh6.mongodb.net/')
  .then(() => console.log("Connected to MongoDB"))
  .catch(error => console.log("MongoDB connection error:", error));

// Define your User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  accountNumber: String,
  email: String,
  role: String,
});
const User = mongoose.model('User', userSchema);

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
};

// Middleware setup
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(helmet()); // Helmet to set secure HTTP headers

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

// Registration endpoint
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!validateUsername(username)) {
    return res.status(400).json({ error: 'Invalid username.' });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({ error: 'Invalid password.' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Payment Processing Endpoint
app.post('/process-payment', authenticateToken, async (req, res) => {
  const { cardNumber, expiryDate, cvv } = req.body;

  const cardNumberRegex = /^\d{16}$/;
  const expiryDateRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
  const cvvRegex = /^\d{3,4}$/;

  if (!cardNumberRegex.test(cardNumber)) {
    return res.status(400).json({ message: 'Invalid card number.' });
  }
  if (!expiryDateRegex.test(expiryDate)) {
    return res.status(400).json({ message: 'Invalid expiry date.' });
  }
  if (!cvvRegex.test(cvv)) {
    return res.status(400).json({ message: 'Invalid CVV.' });
  }

  try {
    res.status(200).json({ success: true, message: 'Payment processed successfully!' });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ success: false, message: 'Payment processing failed. Please try again later.' });
  }
});

// Create and start the HTTPS server
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
  console.log(`Server is running securely on https://localhost:${PORT}`);
});


