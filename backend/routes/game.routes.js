
const express = require('express');
const { pool } = require('../config/db');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all games
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [games] = await connection.query(
      'SELECT * FROM games ORDER BY name'
    );
    
    connection.release();
    
    res.status(200).json({ games });
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({ message: 'Failed to get games' });
  }
});

// Get game by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await pool.getConnection();
    
    const [games] = await connection.query(
      'SELECT * FROM games WHERE id = ?',
      [id]
    );
    
    connection.release();
    
    if (games.length === 0) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    res.status(200).json({ game: games[0] });
  } catch (error) {
    console.error('Get game error:', error);
    res.status(500).json({ message: 'Failed to get game' });
  }
});

// Add a new game (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id, name, description, image_url } = req.body;
    
    if (!id || !name) {
      return res.status(400).json({ message: 'Game ID and name are required' });
    }
    
    const connection = await pool.getConnection();
    
    // Check if the game ID already exists
    const [existingGames] = await connection.query(
      'SELECT id FROM games WHERE id = ?',
      [id]
    );
    
    if (existingGames.length > 0) {
      connection.release();
      return res.status(409).json({ message: 'Game ID already exists' });
    }
    
    // Add the game
    await connection.query(
      'INSERT INTO games (id, name, description, image_url) VALUES (?, ?, ?, ?)',
      [id, name, description || null, image_url || null]
    );
    
    const [newGame] = await connection.query(
      'SELECT * FROM games WHERE id = ?',
      [id]
    );
    
    connection.release();
    
    res.status(201).json({
      message: 'Game added successfully',
      game: newGame[0]
    });
  } catch (error) {
    console.error('Add game error:', error);
    res.status(500).json({ message: 'Failed to add game' });
  }
});

// Update a game (admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Game name is required' });
    }
    
    const connection = await pool.getConnection();
    
    // Check if the game exists
    const [existingGames] = await connection.query(
      'SELECT id FROM games WHERE id = ?',
      [id]
    );
    
    if (existingGames.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Update the game
    await connection.query(
      'UPDATE games SET name = ?, description = ?, image_url = ? WHERE id = ?',
      [name, description || null, image_url || null, id]
    );
    
    const [updatedGame] = await connection.query(
      'SELECT * FROM games WHERE id = ?',
      [id]
    );
    
    connection.release();
    
    res.status(200).json({
      message: 'Game updated successfully',
      game: updatedGame[0]
    });
  } catch (error) {
    console.error('Update game error:', error);
    res.status(500).json({ message: 'Failed to update game' });
  }
});

// Delete a game (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await pool.getConnection();
    
    // Check if the game exists
    const [existingGames] = await connection.query(
      'SELECT id FROM games WHERE id = ?',
      [id]
    );
    
    if (existingGames.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Delete the game (scores will be deleted by CASCADE constraint)
    await connection.query(
      'DELETE FROM games WHERE id = ?',
      [id]
    );
    
    connection.release();
    
    res.status(200).json({
      message: 'Game deleted successfully'
    });
  } catch (error) {
    console.error('Delete game error:', error);
    res.status(500).json({ message: 'Failed to delete game' });
  }
});

module.exports = router;
