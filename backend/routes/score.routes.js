const express = require('express');
const { pool } = require('../config/db');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all scores
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [scores] = await connection.query(`
      SELECT 
        s.id, 
        s.points, 
        s.date, 
        u.id AS userId, 
        u.username, 
        g.id AS gameId, 
        g.name AS gameName
      FROM scores s
      JOIN users u ON s.user_id = u.id
      JOIN games g ON s.game_id = g.id
      ORDER BY s.points DESC
    `);
    
    connection.release();
    
    res.status(200).json({ scores });
  } catch (error) {
    console.error('Get scores error:', error);
    res.status(500).json({ message: 'Failed to get scores' });
  }
});

// Get scores by game
router.get('/game/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    
    const connection = await pool.getConnection();
    
    const [scores] = await connection.query(`
      SELECT 
        s.id, 
        s.points, 
        s.date, 
        u.id AS userId, 
        u.username, 
        g.id AS gameId, 
        g.name AS gameName
      FROM scores s
      JOIN users u ON s.user_id = u.id
      JOIN games g ON s.game_id = g.id
      WHERE g.id = ?
      ORDER BY s.points DESC
      LIMIT ?
    `, [gameId, limit]);
    
    connection.release();
    
    res.status(200).json({ scores });
  } catch (error) {
    console.error('Get game scores error:', error);
    res.status(500).json({ message: 'Failed to get game scores' });
  }
});

// Get user scores
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const connection = await pool.getConnection();
    
    const [scores] = await connection.query(`
      SELECT 
        s.id, 
        s.points, 
        s.date, 
        u.id AS userId, 
        u.username, 
        g.id AS gameId, 
        g.name AS gameName
      FROM scores s
      JOIN users u ON s.user_id = u.id
      JOIN games g ON s.game_id = g.id
      WHERE u.id = ?
      ORDER BY s.date DESC
    `, [userId]);
    
    connection.release();
    
    res.status(200).json({ scores });
  } catch (error) {
    console.error('Get user scores error:', error);
    res.status(500).json({ message: 'Failed to get user scores' });
  }
});

// Add a new score
router.post('/', verifyToken, async (req, res) => {
  try {
    // Log para verificar los datos recibidos
    console.log("Datos recibidos:", req.body);  // Aquí vemos qué datos llegan
    console.log('BODY:', req.body);
    console.log('USER ID:', req.userId);

    const { gameId, points } = req.body;

    if (!gameId || points === undefined) {
      return res.status(400).json({ message: 'Game ID and points are required' });
    }

    const connection = await pool.getConnection();
    
    // Check if the game exists
    const [games] = await connection.query('SELECT id FROM games WHERE id = ?', [gameId]);
    
    if (games.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Ensure that the user is valid (though `verifyToken` already handles this, it's good practice)
    const [user] = await connection.query('SELECT id FROM users WHERE id = ?', [req.userId]);
    
    if (user.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Add the score to the database
    const [result] = await connection.query(
      'INSERT INTO scores (user_id, game_id, points) VALUES (?, ?, ?)',
      [req.userId, gameId, points]
    );

    // Retrieve the newly created score entry
    const [scoreEntries] = await connection.query(`
      SELECT 
        s.id, 
        s.points, 
        s.date, 
        u.id AS userId, 
        u.username, 
        g.id AS gameId, 
        g.name AS gameName
      FROM scores s
      JOIN users u ON s.user_id = u.id
      JOIN games g ON s.game_id = g.id
      WHERE s.id = ?
    `, [result.insertId]);
    
    connection.release();
    
    res.status(201).json({
      message: 'Score added successfully',
      score: scoreEntries[0]
    });
  } catch (error) {
    console.error('Add score error:', error);
    res.status(500).json({ message: 'Failed to add score' });
  }
});

module.exports = router;
