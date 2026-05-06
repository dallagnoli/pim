const pool = require("../db/pool");

exports.getAll = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM links ORDER BY created_at DESC"
  );
  res.json(result.rows);
};

exports.create = async (req, res) => {
  const { title, url } = req.body;

  const result = await pool.query(
    "INSERT INTO links (title, url, created_at) VALUES ($1, $2, NOW()) RETURNING *",
    [title, url]
  );

  res.json(result.rows[0]);
};