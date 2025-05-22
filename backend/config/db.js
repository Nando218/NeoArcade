const { Pool } = require('pg');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

let pool;
if (process.env.NODE_ENV === 'test') {
  // Usar una base de datos de test (puede ser SQLite o una base específica de test en PostgreSQL)
  pool = new Pool({
    connectionString: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
    ssl: process.env.TEST_DATABASE_URL ? false : { rejectUnauthorized: false },
  });
} else {
  // Producción/desarrollo normal
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
}

// Test de conexión y logging 
async function testConnection() {
  try {
    console.log('Attempting to connect to PostgreSQL database with Neon...');
    console.log('Connection string:', process.env.DATABASE_URL ? 'Defined' : 'Undefined');
    const client = await pool.connect();
    console.log('✅ Database connected successfully to Neon');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Inicializar tablas y datos por defecto
async function initDb() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Tabla de usuarios
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de juegos
    await client.query(`
      CREATE TABLE IF NOT EXISTS games (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        image_url TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de puntuaciones
    await client.query(`
      CREATE TABLE IF NOT EXISTS scores (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        game_id VARCHAR(50) NOT NULL REFERENCES games(id) ON DELETE CASCADE,
        points INTEGER NOT NULL,
        date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Juegos por defecto
    await client.query(`
      INSERT INTO games (id, name, description, image_url)
      VALUES
        ('tetris', 'Tetris', 'El clásico juego de bloques ruso', '/images/games/tetris.jpg'),
        ('tictactoe', 'Tres en Raya', 'Clásico juego de X y O', '/images/games/tictactoe.jpg'),
        ('snake', 'Snake', 'Controla una serpiente y come manzanas', '/images/games/snake.jpg'),
        ('pong', 'Pong', 'El primer videojuego arcade de la historia', '/images/games/pong.jpg'),
        ('pacman', 'Pac-Man', 'Come todos los puntos mientras evitas los fantasmas', '/images/games/pacman.jpg'),
        ('arkanoid', 'Arkanoid', 'Destruye todos los bloques con la bola', '/images/games/arkanoid.jpg'),
        ('connect4', 'Connect 4', 'Conecta cuatro fichas del mismo color', '/images/games/connect4.jpg')
      ON CONFLICT (id) DO NOTHING;
    `);

    // Usuario admin
    const adminHashedPassword = await bcrypt.hash('admin123', 10);
    await client.query(`
      INSERT INTO users (username, email, password, role)
      VALUES ('admin', 'admin@arcade.com', $1, 'admin')
      ON CONFLICT (username) DO NOTHING;
    `, [adminHashedPassword]);

    // Usuario normal
    const userHashedPassword = await bcrypt.hash('user123', 10);
    await client.query(`
      INSERT INTO users (username, email, password, role)
      VALUES ('user', 'user@arcade.com', $1, 'user')
      ON CONFLICT (username) DO NOTHING;
    `, [userHashedPassword]);

    await client.query('COMMIT');
    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error initializing database:', error);
  } finally {
    client.release();
  }
}

async function resetDb() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM scores');
    await client.query('DELETE FROM users');
    await client.query('DELETE FROM games WHERE id NOT IN (\'tetris\', \'tictactoe\', \'snake\', \'pong\', \'pacman\', \'arkanoid\', \'connect4\')');
    // Reinsertar usuarios por defecto
    const adminHashedPassword = await bcrypt.hash('admin123', 10);
    await client.query(`
      INSERT INTO users (username, email, password, role)
      VALUES ('admin', 'admin@arcade.com', $1, 'admin')
      ON CONFLICT (username) DO NOTHING;
    `, [adminHashedPassword]);
    const userHashedPassword = await bcrypt.hash('user123', 10);
    await client.query(`
      INSERT INTO users (username, email, password, role)
      VALUES ('user', 'user@arcade.com', $1, 'user')
      ON CONFLICT (username) DO NOTHING;
    `, [userHashedPassword]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  testConnection,
  initDb,
  resetDb,
};
