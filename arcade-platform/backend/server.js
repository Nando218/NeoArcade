const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar CORS para permitir solicitudes desde el frontend
app.use(cors({
  origin: "http://localhost:5173", // Cambia esto si el frontend se aloja en otro sitio
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

// Middleware para parsear JSON
app.use(express.json());

// Importar rutas
const userRoutes = require("./routes/userRoutes");
const gameRoutes = require("./routes/gameRoutes");
const scoreRoutes = require("./routes/scoreRoutes");

// Usar rutas
app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/scores", scoreRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

//proband2
app.get("/api/test", (req, res) => {
  res.json({ message: "🚀 Backend is working!" });
});

