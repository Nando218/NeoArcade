
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
async function testConnection() {
  try {
    console.log('Attempting to connect to MySQL database...');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

// Initialize database tables if they don't exist
async function initDb() {
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create games table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS games (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create scores table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS scores (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        game_id VARCHAR(50) NOT NULL,
        points INT NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
      )
    `);
    
    // Insert default games
    await connection.query(`
      INSERT IGNORE INTO games (id, name, description, image_url) VALUES
      ('tetris', 'Tetris', 'El clásico juego de bloques ruso', '/images/games/tetris.jpg'),
      ('tictactoe', 'Tres en Raya', 'Clásico juego de X y O', '/images/games/tictactoe.jpg'),
      ('snake', 'Snake', 'Controla una serpiente y come manzanas', '/images/games/snake.jpg'),
      ('pong', 'Pong', 'El primer videojuego arcade de la historia', '/images/games/pong.jpg')
    `);
    
    // Insert default admin user
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await connection.query(`
      INSERT IGNORE INTO users (username, email, password, role) VALUES
      ('admin', 'admin@arcade.com', ?, 'admin')
    `, [hashedPassword]);
    
    // Insert default regular user
    const userHashedPassword = await bcrypt.hash('user123', 10);
    
    await connection.query(`
      INSERT IGNORE INTO users (username, email, password, role) VALUES
      ('user', 'user@arcade.com', ?, 'user')
    `, [userHashedPassword]);
    
    console.log('Database tables initialized successfully');
    connection.release();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Export pool for use in other files
module.exports = {
  pool,
  testConnection,
  initDb
};
