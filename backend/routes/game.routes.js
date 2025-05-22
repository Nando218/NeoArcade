const express = require('express');
const { pool } = require('../config/db');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// Obtener todos los juegos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games ORDER BY name');
    res.status(200).json({ games: result.rows });
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({ message: 'Failed to get games' });
  }
});

// Obtener juego por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM games WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.status(200).json({ game: result.rows[0] });
  } catch (error) {
    console.error('Get game error:', error);
    res.status(500).json({ message: 'Failed to get game' });
  }
});

// Añadir un juego nuevo (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id, name, description, image_url } = req.body;
    if (!id || !name) {
      return res.status(400).json({ message: 'Game id and name are required' });
    }
    // Verificar si el nombre o id del juego ya existe
    const existing = await pool.query('SELECT 1 FROM games WHERE id = $1 OR name = $2', [id, name]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Game with this id or name already exists' });
    }
    await pool.query(
      'INSERT INTO games (id, name, description, image_url) VALUES ($1, $2, $3, $4)',
      [id, name, description || null, image_url || null]
    );
    const result = await pool.query('SELECT * FROM games WHERE id = $1', [id]);
    res.status(201).json({ message: 'Game added successfully', game: result.rows[0] });
  } catch (error) {
    console.error('Add game error:', error);
    res.status(500).json({ message: 'Failed to add game' });
  }
});

// Actualizar un juego (admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Game name is required' });
    }
    const existing = await pool.query('SELECT id FROM games WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Game not found' });
    }
    await pool.query(
      'UPDATE games SET name = $1, description = $2, image_url = $3 WHERE id = $4',
      [name, description || null, image_url || null, id]
    );
    const result = await pool.query('SELECT * FROM games WHERE id = $1', [id]);
    res.status(200).json({ message: 'Game updated successfully', game: result.rows[0] });
  } catch (error) {
    console.error('Update game error:', error);
    res.status(500).json({ message: 'Failed to update game' });
  }
});

// Borrar un juego (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT id FROM games WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Game not found' });
    }
    await pool.query('DELETE FROM games WHERE id = $1', [id]);
    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Delete game error:', error);
    res.status(500).json({ message: 'Failed to delete game' });
  }
});

module.exports = router;
