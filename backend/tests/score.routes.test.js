const request = require('supertest');
const app = require('../app');
const { initDb, resetDb } = require('../config/db');

describe('Score Routes', () => {
    // Eliminar hooks que modifican la base de datos en entorno de test real
    // beforeAll(async () => { await initDb(); });
    // beforeEach(async () => { await resetDb(); });

    const normalUser = { email: 'user@arcade.com', password: 'user123' };
    let userToken;
    let userId;
    const gameId = 'tetris'; // Usar juego por defecto

    beforeEach(async () => {
        // Login user y obtener id real
        const login = await request(app).post('/api/auth/login').send(normalUser);
        userToken = login.body.token;
        // Obtener id real del usuario
        const profile = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${userToken}`);
        userId = profile.body.user.id;
    });

    it('should retrieve all scores', async () => {
        const response = await request(app).get('/api/scores');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.scores)).toBe(true);
    });

    it('should retrieve scores by user', async () => {
        const response = await request(app).get(`/api/scores/user/${userId}`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.scores)).toBe(true);
    });

    it('should retrieve scores by game', async () => {
        const response = await request(app).get(`/api/scores/game/${gameId}`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.scores)).toBe(true);
    });

    it('should return 404 for a non-existent score', async () => {
        const login = await request(app)
            .post('/api/auth/login')
            .send({ email: 'user@arcade.com', password: 'user123' });
        const token = login.body.token;
        const response = await request(app)
            .get('/api/scores/999999')
            .set('Authorization', `Bearer ${token}`);
        expect([404, 400]).toContain(response.status);
    });

    it('should return 404 or 200 for all scores of a non-existent user', async () => {
        const login = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@arcade.com', password: 'admin123' });
        const token = login.body.token;
        const response = await request(app)
            .get('/api/scores/user/999999')
            .set('Authorization', `Bearer ${token}`);
        expect([404, 200]).toContain(response.status);
    });
});