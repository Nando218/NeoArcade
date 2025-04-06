const express = require("express");
const db = require("../config/db");

const router = express.Router();

// Save score
router.post("/", (req, res) => {
  const { user_id, game_id, score } = req.body;

  if (!user_id || !game_id || !score) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query(
    "INSERT INTO scores (user_id, game_id, score) VALUES (?, ?, ?)",
    [user_id, game_id, score],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Score added successfully", score_id: result.insertId });
    }
  );
});


// Get leaderboard
router.get("/:game_id", (req, res) => {
  const { game_id } = req.params;

  db.query(
    "SELECT users.username, scores.score FROM scores JOIN users ON scores.user_id = users.id WHERE scores.game_id = ? ORDER BY scores.score DESC LIMIT 10",
    [game_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

module.exports = router;
