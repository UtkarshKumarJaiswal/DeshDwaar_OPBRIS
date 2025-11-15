const mongoose = require('mongoose');
const { connectDB } = require('../server');
const User = require('../models/User');

jest.setTimeout(30000);

describe('MongoDB connection and CRUD', () => {
  beforeAll(async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI environment variable is required for this test');
    await connectDB(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('create, disconnect, reconnect and find user', async () => {
    const email = `test${Date.now()}@example.com`;
    // Generate a random 12-digit aadhar-like number
    const aadhar = Math.floor(100000000000 + Math.random() * 900000000000).toString();

    const user = new User({
      firstName: 'Test',
      lastName: 'User',
      email,
      phone: '+911234567890',
      password: 'Password123!',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'other',
      maritalStatus: 'single',
      aadharNumber: aadhar
    });

    // Save the user
    await user.save();

    // Disconnect to simulate app restart
    await mongoose.disconnect();

    // Reconnect
    await connectDB(process.env.MONGODB_URI);

    // Find the user
    const found = await User.findOne({ email }).select('+password');
    expect(found).not.toBeNull();
    expect(found.email).toBe(email);

    // Cleanup
    await User.deleteOne({ email });
  });
});
