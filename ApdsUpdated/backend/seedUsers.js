// seedUsers.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Adjust the path if necessary

const users = [
  {
    username: 'employee1',
    password: 'Password123',
  },
  {
    username: 'employee2',
    password: 'SecurePass456',
  },
  // Add more users as needed
];

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB for seeding');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Hash passwords and insert users
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { username: user.username, password: hashedPassword };
      })
    );

    await User.insertMany(hashedUsers);
    console.log('Seeded users successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding users:', error);
    mongoose.connection.close();
  }
}

seedUsers();
