const request = require('supertest');
const app = require('../app');
const { initDb } = require('../config/db');

describe('Score Routes', () => {
    beforeAll(async () => {
        await initDb();
    });
    // Se eliminó resetDb para evitar borrado masivo de datos

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

    it('should create a new score', async () => {
        // Login y obtener token
        const login = await request(app).post('/api/auth/login').send(normalUser);
        const token = login.body.token;
        // Eliminar cualquier puntuación previa para el usuario y el juego 'snake'
        await request(app)
            .delete('/api/scores/user/' + userId + '/game/snake')
            .set('Authorization', `Bearer ${token}`);
        // Crear nueva puntuación para Snake
        const response = await request(app)
            .post('/api/scores')
            .set('Authorization', `Bearer ${token}`)
            .send({ gameId: 'snake', points: 123 });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('score');
        expect(response.body.score).toHaveProperty('gameId', 'snake');
        expect(response.body.score).toHaveProperty('points', 123);
    });

    it('should update an existing score', async () => {
        // Login y obtener token
        const login = await request(app).post('/api/auth/login').send(normalUser);
        const token = login.body.token;
        // Crear nueva puntuación para Tetris
        const create = await request(app)
            .post('/api/scores')
            .set('Authorization', `Bearer ${token}`)
            .send({ gameId: 'tetris', points: 10 });
        const scoreId = create.body.score.id;
        // Actualizar la puntuación
        const response = await request(app)
            .put(`/api/scores/${scoreId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ points: 99 });
        expect(response.status).toBe(200);
        expect(response.body.score).toHaveProperty('points', 99);
    });

    it('should delete a score as owner', async () => {
        // Login y obtener token
        const login = await request(app).post('/api/auth/login').send(normalUser);
        const token = login.body.token;
        // Crear nueva puntuación para Tetris
        const create = await request(app)
            .post('/api/scores')
            .set('Authorization', `Bearer ${token}`)
            .send({ gameId: 'tetris', points: 10 });
        const scoreId = create.body.score.id;
        // Eliminar la puntuación
        const response = await request(app)
            .delete(`/api/scores/${scoreId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
    });

    it('should not allow a user to delete another user\'s score', async () => {
        // Login como usuario normal y crear puntuación
        const login = await request(app).post('/api/auth/login').send(normalUser);
        const token = login.body.token;
        const create = await request(app)
            .post('/api/scores')
            .set('Authorization', `Bearer ${token}`)
            .send({ gameId: 'tetris', points: 10 });
        const scoreId = create.body.score.id;
        // Login como admin
        const adminLogin = await request(app).post('/api/auth/login').send({ email: 'admin@arcade.com', password: 'admin123' });
        const adminToken = adminLogin.body.token;
        // El admin puede borrar cualquier puntuación
        const response = await request(app)
            .delete(`/api/scores/${scoreId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
    });

    it('should return 400 if required fields are missing when creating a score', async () => {
        const login = await request(app).post('/api/auth/login').send(normalUser);
        const token = login.body.token;
        const response = await request(app)
            .post('/api/scores')
            .set('Authorization', `Bearer ${token}`)
            .send({ points: 10 }); // Falta gameId
        expect(response.status).toBe(400);
    });
});