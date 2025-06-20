const request = require('supertest');
const app = require('../app');

// Tests para las rutas de autenticación (login, perfil, casos de error)
describe('Auth Routes', () => {
    // Usuarios de prueba para los escenarios de login
    const adminUser = { email: 'admin@arcade.com', password: 'admin123' };
    const normalUser = { email: 'user@arcade.com', password: 'user123' };
    let token;

    // Test: Login exitoso para un usuario existente
    it('should log in an existing user', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send(normalUser);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        token = response.body.token;
    });

    // Test: El login falla con credenciales incorrectas
    it('should fail to log in with incorrect credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'wronguser@example.com', password: 'wrongpass' });
        expect([400, 401]).toContain(response.status);
    });

    // Test: Obtener el perfil del usuario tras login (con token válido)
    it('should get user profile', async () => {
        // Primero hace login
        const login = await request(app)
            .post('/api/auth/login')
            .send(normalUser);
        token = login.body.token;
        const response = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.user).toHaveProperty('email', normalUser.email);
    });

    // Test: Login como admin y obtener perfil de admin (verifica el rol)
    it('should log in as admin and get admin profile', async () => {
        const login = await request(app)
            .post('/api/auth/login')
            .send(adminUser);
        expect(login.status).toBe(200);
        expect(login.body).toHaveProperty('token');
        const token = login.body.token;
        const response = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.user).toHaveProperty('email', adminUser.email);
        expect(response.body.user).toHaveProperty('role', 'admin');
    });

    // Test: Acceso al perfil sin token debe fallar
    it('should fail to get profile without token', async () => {
        const response = await request(app)
            .get('/api/auth/me');
        expect([401, 403]).toContain(response.status);
    });

    // Test: El login falla con formato de email inválido
    it('should fail to log in with invalid email format', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'notanemail', password: 'somepass' });
        expect([400, 401]).toContain(response.status);
    });

    // Test: Acceso al perfil con un token inválido (usuario inexistente)
    it('should fail to get profile for a non-existent user (invalid token)', async () => {
        // Token con un user id inválido (por ejemplo, manipulado o expirado)
        const invalidToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMzQ1Njc4OTAsImVtYWlsIjoibm9uZXhpc3RlbnRAZXhhbXBsZS5jb20iLCJpYXQiOjE2MDAwMDAwMDB9.invalidsignature';
        const response = await request(app)
            .get('/api/auth/me')
            .set('Authorization', invalidToken);
        expect([401, 403]).toContain(response.status);
    });
});