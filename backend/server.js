const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Importar conexión y setup de base de datos
const { testConnection, initDb } = require('./config/db');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const scoreRoutes = require('./routes/score.routes');
const gameRoutes = require('./routes/game.routes');

// Crear app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080'], // Agrega tu frontend si lo despliegas
  credentials: true
}));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/games', gameRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to NeoArcade API' });
});

// Función principal: testea conexión, inicializa DB y lanza el servidor
async function startServer() {
  try {
    console.log('🔌 Verificando conexión con la base de datos...');
    await testConnection();

    console.log('🛠️ Inicializando base de datos...');
    await initDb();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1); // Salir si hay error crítico
  }
}

// Ejecutar
startServer();
