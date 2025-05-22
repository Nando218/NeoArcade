const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const scoreRoutes = require('./routes/score.routes');
const gameRoutes = require('./routes/game.routes');

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080'],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/games', gameRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to NeoArcade API' });
});

module.exports = app;
