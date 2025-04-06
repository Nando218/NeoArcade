const express = require("express");
const db = require("../config/db");

const router = express.Router();

// Get all games
router.get("/", (req, res) => {
  db.query("SELECT * FROM games", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
