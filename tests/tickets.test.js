const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server/app');

let authToken;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
    const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'user@local.com', password: 'secret123' });
    authToken = res.body.token;
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
});

describe('Ticket Endpoints', () => {
    it('should create a new ticket', async () => {
        const res = await request(app)
            .post('/api/tickets')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'Test ticket', description: 'Test desc' });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.title).toBe('Test ticket');
    });

    it('should fetch all tickets', async () => {
        const res = await request(app)
            .get('/api/tickets')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });
});
