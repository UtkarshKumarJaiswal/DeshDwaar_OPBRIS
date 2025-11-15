const request = require('supertest');
const mongoose = require('mongoose');
const { app, connectDB } = require('../server');
const User = require('../models/User');

jest.setTimeout(30000);

describe('Auth endpoints', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI environment variable is required for this test');
    await connectDB(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('register -> login -> profile', async () => {
    const email = `auth${Date.now()}@example.com`;
    const password = 'Password123!';

    // Register
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Auth',
        lastName: 'Tester',
        email,
        phone: '+911234567891',
        password,
        confirmPassword: password,
        dateOfBirth: '1990-01-01',
        gender: 'other',
        maritalStatus: 'single',
        aadharNumber: '123412341234'
      })
      .expect(201);

    expect(regRes.body).toHaveProperty('token');

    // Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password })
      .expect(200);

    expect(loginRes.body).toHaveProperty('token');
    const token = loginRes.body.token;

    // Profile
    const profileRes = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(profileRes.body.success).toBe(true);
    expect(profileRes.body.user.email).toBe(email);

    // Cleanup
    await User.deleteOne({ email });
  });
});
