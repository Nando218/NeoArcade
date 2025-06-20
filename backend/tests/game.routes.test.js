const request = require('supertest');
const app = require('../app');
const { initDb, resetDb } = require('../config/db');

// Tests para las rutas de juegos (CRUD)
describe('Game Routes', () => {
    // Token de admin y datos de juego de prueba
    let adminToken;
    let createdGameId = 'testgame1';
    const adminUser = { email: 'admin@arcade.com', password: 'admin123' };
    const gameData = { id: createdGameId, name: 'Test Game', description: 'A test game', image_url: 'http://test.com/game.png' };

    // Antes de todos los tests, loguea como admin para obtener el token
    beforeAll(async () => {
        const login = await request(app).post('/api/auth/login').send(adminUser);
        adminToken = login.body.token;
    });

    // Test: Crear un nuevo juego
    it('should create a new game', async () => {
        const response = await request(app)
            .post('/api/games')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(gameData);
        expect([200, 201]).toContain(response.status);
        expect(response.body).toHaveProperty('game');
        expect(response.body.game).toHaveProperty('id', createdGameId);
    });

    // Test: Obtener un juego por su id
    it('should retrieve a game by id', async () => {
        const response = await request(app).get('/api/games/tetris');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('game');
        expect(response.body.game).toHaveProperty('id', 'tetris');
    });

    // Test: Obtener todos los juegos
    it('should get all games', async () => {
        const response = await request(app)
            .get('/api/games');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.games)).toBe(true);
        expect(response.body.games.length).toBeGreaterThan(0);
    });

    // Test: Retorna 404 si el juego no existe (por id)
    it('should return 404 for non-existent game', async () => {
        const response = await request(app)
            .get('/api/games/thisdoesnotexist');
        expect(response.status).toBe(404);
    });

    // Test: Retorna 404 o 400 si el juego no existe (con autenticación)
    it('should return 404 for a non-existent game', async () => {
        const login = await request(app)
            .post('/api/auth/login')
            .send({ email: 'user@arcade.com', password: 'user123' });
        const token = login.body.token;
        const response = await request(app)
            .get('/api/games/999999')
            .set('Authorization', `Bearer ${token}`);
        expect([404, 400]).toContain(response.status);
    });

    // Test: Actualizar un juego existente
    it('should update a game', async () => {
        await request(app)
            .post('/api/games')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(gameData);
        const response = await request(app)
            .put(`/api/games/${createdGameId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Updated Game', description: 'Updated', image_url: 'http://test.com/updated.png' });
        expect(response.status).toBe(200);
        expect(response.body.game).toHaveProperty('name', 'Updated Game');
    });

    // Test: Eliminar un juego existente
    it('should delete a game', async () => {
        await request(app)
            .post('/api/games')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(gameData);
        const response = await request(app)
            .delete(`/api/games/${createdGameId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
    });
});