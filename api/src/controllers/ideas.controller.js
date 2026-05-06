const pool = require("../db/pool");

exports.getAll = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM ideas ORDER BY created_at DESC"
  );
  res.json(result.rows);
};

exports.create = async (req, res) => {
  const { content } = req.body;

  const result = await pool.query(
    "INSERT INTO ideas (content, created_at) VALUES ($1, NOW()) RETURNING *",
    [content]
  );

  res.json(result.rows[0]);
};