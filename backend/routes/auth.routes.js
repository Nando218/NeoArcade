const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Verifica si el usuario ya existe
    const client = await pool.connect();
    const existingEmails = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (existingEmails.rows.length > 0) {
      client.release();
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Verifica si el nombre de usuario ya existe
    const existingUsernames = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    
    if (existingUsernames.rows.length > 0) {
      client.release();
      return res.status(409).json({ message: 'Username already exists' });
    }
    
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear nuevo usuario
    const result = await client.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, role',
      [username, email, hashedPassword]
    );

    client.release();
    
    // Generar token JWT
    const token = jwt.sign(
      { id: result.rows[0].id, role: result.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0],
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email });
    
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const client = await pool.connect();
    
    // Buscar usuario por email
    const users = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    
    console.log('User found in database:', users.rows.length > 0);
    
    client.release();
    
    if (users.rows.length === 0) {
      console.log('Login failed: User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = users.rows[0];
    
    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    console.log('Password validation:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Login failed: Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    // Eliminar la contraseña del objeto de usuario
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Get current user profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    const client = await pool.connect();
    
    const users = await client.query(
      'SELECT id, username, email, role FROM users WHERE id = $1',
      [req.userId]
    );
    
    client.release();
    
    if (users.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ user: users.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to get profile' });
  }
});

// ADMIN ROUTES

// Get all users (admin only)
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const client = await pool.connect();
    
    const users = await client.query(
      'SELECT id, username, email, role, created_at FROM users'
    );
    
    client.release();
    
    // Remove sensitive information
    const safeUsers = users.rows.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.status(200).json({ users: safeUsers });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Failed to get users' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Don't allow admins to delete themselves
    if (parseInt(id) === req.userId) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    const client = await pool.connect();
    
    const users = await client.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    
    if (users.rows.length === 0) {
      client.release();
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user
    await client.query(
      'DELETE FROM users WHERE id = $1',
      [id]
    );
    
    client.release();
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Update user role (admin only)
router.patch('/users/:id/role', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    // Don't allow admins to change their own role
    if (parseInt(id) === req.userId) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }
    
    const client = await pool.connect();
    
    const users = await client.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    
    if (users.rows.length === 0) {
      client.release();
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user role
    await client.query(
      'UPDATE users SET role = $1 WHERE id = $2',
      [role, id]
    );
    
    const updatedUsers = await client.query(
      'SELECT id, username, email, role FROM users WHERE id = $1',
      [id]
    );
    
    client.release();
    
    res.status(200).json({ 
      message: 'User role updated successfully',
      user: updatedUsers.rows[0]
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Failed to update user role' });
  }
});

module.exports = router;
