const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server/app');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
});

describe('Auth Endpoints', () => {
    it('should signup a user', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({ email: 'test@example.com', password: 'secret123' });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should login the same user', async () => {
        const resLogin = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'secret123' });
        expect(resLogin.statusCode).toBe(200);
        expect(resLogin.body).toHaveProperty('token');
    });
});
