
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import database connection
const { testConnection, initDb } = require('./config/db');

// Import route handlers
const authRoutes = require('./routes/auth.routes');
const scoreRoutes = require('./routes/score.routes');
const gameRoutes = require('./routes/game.routes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
(async () => {
  await testConnection();
  await initDb();
})();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080'], // Support both Vite ports
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/games', gameRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to NeoArcade API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
