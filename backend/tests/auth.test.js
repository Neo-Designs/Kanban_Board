/**
 * Assigned to: Udeshi (Client API Services & Automated Testing)
 * Description: Supertest integration test suite for Authentication & Authorization endpoints.
 */
import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';

describe('Authentication API Endpoints', () => {
  beforeEach(() => {
    User.reset();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully and return JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Developer',
          email: 'jane@example.com',
          password: 'password123',
          role: 'Full Stack Engineer',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe('jane@example.com');
      expect(res.body.user.name).toBe('Jane Developer');
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should reject registration when email already exists (409 Conflict)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Alex Duplicate',
          email: 'alex@syncboard.dev', // pre-seeded email
          password: 'password123',
        });

      expect(res.statusCode).toBe(409);
      expect(res.body.message).toMatch(/already exists/i);
    });

    it('should reject registration when required fields are missing or invalid (400)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'J',
          email: 'not-an-email',
          password: '123',
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate pre-seeded user and return JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'alex@syncboard.dev',
          password: 'password123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('alex@syncboard.dev');
    });

    it('should reject login with wrong password (401 Unauthorized)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'alex@syncboard.dev',
          password: 'wrongpassword',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/invalid email or password/i);
    });

    it('should reject login with non-existent user email (401 Unauthorized)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'unknown@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user profile when valid token provided', async () => {
      // First login to acquire token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'alex@syncboard.dev',
          password: 'password123',
        });

      const token = loginRes.body.token;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.user.email).toBe('alex@syncboard.dev');
    });

    it('should reject access without Authorization header (401)', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toBe(401);
    });
  });
});
