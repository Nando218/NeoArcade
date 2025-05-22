const request = require('supertest');
const app = require('../app');

describe('Auth Routes', () => {
    const adminUser = { email: 'admin@arcade.com', password: 'admin123' };
    const normalUser = { email: 'user@arcade.com', password: 'user123' };
    let token;

    it('should log in an existing user', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send(normalUser);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        token = response.body.token;
    });

    it('should fail to log in with incorrect credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'wronguser@example.com', password: 'wrongpass' });
        expect([400, 401]).toContain(response.status);
    });

    it('should get user profile', async () => {
        // Login first
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

    it('should fail to get profile without token', async () => {
        const response = await request(app)
            .get('/api/auth/me');
        expect([401, 403]).toContain(response.status);
    });

    it('should fail to log in with invalid email format', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'notanemail', password: 'somepass' });
        expect([400, 401]).toContain(response.status);
    });

    it('should fail to get profile for a non-existent user (invalid token)', async () => {
        // Token with invalid user id (e.g., tampered or expired)
        const invalidToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMzQ1Njc4OTAsImVtYWlsIjoibm9uZXhpc3RlbnRAZXhhbXBsZS5jb20iLCJpYXQiOjE2MDAwMDAwMDB9.invalidsignature';
        const response = await request(app)
            .get('/api/auth/me')
            .set('Authorization', invalidToken);
        expect([401, 403]).toContain(response.status);
    });
});