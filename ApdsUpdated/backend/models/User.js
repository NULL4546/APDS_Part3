// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for the user model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Enforces unique usernames
  },
  password: {
    type: String,
    required: true,
  }
});

// Method to hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if entered password matches stored hashed password
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
