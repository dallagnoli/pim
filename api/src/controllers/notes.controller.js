const pool = require("../db/pool");

exports.getAll = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM notes ORDER BY created_at DESC"
  );
  res.json(result.rows);
};

exports.create = async (req, res) => {
  const { title, content } = req.body;

  const result = await pool.query(
    "INSERT INTO notes (title, content, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING *",
    [title, content]
  );

  res.json(result.rows[0]);
};