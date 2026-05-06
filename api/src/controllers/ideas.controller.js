const pool = require("../db/pool");
const { created, success, deleted, error } = require("../utils/response");

exports.getAll = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM ideas ORDER BY created_at DESC"
  );
  success(res, result.rows);
};

exports.create = async (req, res) => {
  const { content } = req.body;

  const result = await pool.query(
    "INSERT INTO ideas (content, created_at) VALUES ($1, NOW()) RETURNING *",
    [content]
  );

  created(res, result.rows[0]);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const result = await pool.query(
    "UPDATE ideas SET content = $1 WHERE id = $2 RETURNING *",
    [content, id]
  );

  if (result.rows.length === 0) {
    return error(res, "not found", 404);
  }

  success(res, result.rows[0]);
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "DELETE FROM ideas WHERE id = $1 RETURNING *",
    [id]
  );

  if (result.rows.length === 0) {
    return error(res, "not found", 404);
  }

  deleted(res);
};