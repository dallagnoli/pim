const pool = require("../db/pool");

exports.getAll = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM tasks ORDER BY created_at DESC"
  );
  res.json(result.rows);
};

exports.create = async (req, res) => {
  const { title } = req.body;

  const result = await pool.query(
    "INSERT INTO tasks (title, done, created_at) VALUES ($1, false, NOW()) RETURNING *",
    [title]
  );

  res.json(result.rows[0]);
};

exports.toggle = async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;

  const result = await pool.query(
    "UPDATE tasks SET done=$1 WHERE id=$2 RETURNING *",
    [done, id]
  );

  res.json(result.rows[0]);
};