
const express = require('express');
const { pool } = require('../config/db');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Obtener todas las puntuaciones
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id, 
        s.points, 
        s.date, 
        u.id AS user_id, 
        u.username, 
        g.id AS game_id, 
        g.name AS game_name
      FROM scores s
      JOIN users u ON s.user_id = u.id
      JOIN games g ON s.game_id = g.id
      ORDER BY s.points DESC
    `);
    
    const scores = result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      username: row.username,
      gameId: row.game_id,
      gameName: row.game_name,
      points: row.points,
      date: row.date
    }));
    
    res.status(200).json({ scores });
  } catch (error) {
    console.error('Get scores error:', error);
    res.status(500).json({ message: 'Failed to get scores' });
  }
});

// obtener puntuaciones de un juego
router.get('/game/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await pool.query(`
      SELECT 
        s.id, 
        s.points, 
        s.date, 
        u.id AS user_id, 
        u.username, 
        g.id AS game_id, 
        g.name AS game_name
      FROM scores s
      JOIN users u ON s.user_id = u.id
      JOIN games g ON s.game_id = g.id
      WHERE g.id = $1
      ORDER BY s.points DESC
      LIMIT $2
    `, [gameId, limit]);
    
    const scores = result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      username: row.username,
      gameId: row.game_id,
      gameName: row.game_name,
      points: row.points,
      date: row.date
    }));
    
    res.status(200).json({ scores });
  } catch (error) {
    console.error('Get game scores error:', error);
    res.status(500).json({ message: 'Failed to get game scores' });
  }
});

// Obtener puntuaciones de un usuario
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await pool.query(`
      SELECT 
        s.id, 
        s.points, 
        s.date, 
        u.id AS user_id, 
        u.username, 
        g.id AS game_id, 
        g.name AS game_name
      FROM scores s
      JOIN users u ON s.user_id = u.id
      JOIN games g ON s.game_id = g.id
      WHERE u.id = $1
      ORDER BY s.date DESC
    `, [userId]);
    
    const scores = result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      username: row.username,
      gameId: row.game_id,
      gameName: row.game_name,
      points: row.points,
      date: row.date
    }));
    
    res.status(200).json({ scores });
  } catch (error) {
    console.error('Get user scores error:', error);
    res.status(500).json({ message: 'Failed to get user scores' });
  }
});

// añadir puntuaciones
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('Score data received:', req.body);
    console.log('User ID from token:', req.userId);

    const { gameId, points } = req.body;

    if (!gameId || points === undefined) {
      return res.status(400).json({ message: 'Game ID and points are required' });
    }

    // Comprobar si el juego existe
    const gameResult = await pool.query('SELECT id FROM games WHERE id = $1', [gameId]);
    
    if (gameResult.rows.length === 0) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Asegurarse de que el usuario exista
    const userResult = await pool.query('SELECT id FROM users WHERE id = $1', [req.userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // añadir puntuaciones
    const scoreResult = await pool.query(
      'INSERT INTO scores (user_id, game_id, points) VALUES ($1, $2, $3) RETURNING id',
      [req.userId, gameId, points]
    );

    // Recuperar la entrada de puntuacion recien creada
    const newScoreResult = await pool.query(`
      SELECT 
        s.id, 
        s.points, 
        s.date, 
        u.id AS user_id, 
        u.username, 
        g.id AS game_id, 
        g.name AS game_name
      FROM scores s
      JOIN users u ON s.user_id = u.id
      JOIN games g ON s.game_id = g.id
      WHERE s.id = $1
    `, [scoreResult.rows[0].id]);
    
    const score = newScoreResult.rows[0] ? {
      id: newScoreResult.rows[0].id,
      userId: newScoreResult.rows[0].user_id,
      username: newScoreResult.rows[0].username,
      gameId: newScoreResult.rows[0].game_id,
      gameName: newScoreResult.rows[0].game_name,
      points: newScoreResult.rows[0].points,
      date: newScoreResult.rows[0].date
    } : null;
    
    res.status(201).json({
      message: 'Score added successfully',
      score: score
    });
  } catch (error) {
    console.error('Add score error:', error);
    res.status(500).json({ message: 'Failed to add score: ' + error.message });
  }
});

module.exports = router;
