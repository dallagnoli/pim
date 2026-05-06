const pool = require("../db/pool");
const { created, success, deleted, error } = require("../utils/response");

exports.getAll = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM notes ORDER BY created_at DESC"
  );
  success(res, result.rows);
};

exports.create = async (req, res) => {
  const { title, content } = req.body;

  const result = await pool.query(
    "INSERT INTO notes (title, content, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING *",
    [title, content]
  );

  created(res, result.rows[0]);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const result = await pool.query(
    `UPDATE notes
     SET title = $1,
         content = $2,
         updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [title, content, id]
  );

  if (result.rows.length === 0) {
    return error(res, "not found", 404);
  }

  success(res, result.rows[0]);
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "DELETE FROM notes WHERE id = $1 RETURNING *",
    [id]
  );

  if (result.rows.length === 0) {
    return error(res, "not found", 404);
  }

  deleted(res);
};