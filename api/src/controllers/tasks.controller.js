const pool = require("../db/pool");
const { created, success, deleted, error } = require("../utils/response");

exports.getAll = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM tasks ORDER BY created_at DESC"
  );
  success(res, result.rows);
};

exports.create = async (req, res) => {
  const { title } = req.body;

  const result = await pool.query(
    "INSERT INTO tasks (title, done, created_at) VALUES ($1, false, NOW()) RETURNING *",
    [title]
  );

  created(res, result.rows[0]);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { title, done } = req.body;

  const result = await pool.query(
    `UPDATE tasks
     SET title = $1,
         done = $2
     WHERE id = $3
     RETURNING *`,
    [title, done, id]
  );

  if (result.rows.length === 0) {
    return error(res, "not found", 404);
  }

  success(res, result.rows[0]);
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "DELETE FROM tasks WHERE id = $1 RETURNING *",
    [id]
  );

  if (result.rows.length === 0) {
    return error(res, "not found", 404);
  }

  deleted(res);
};

exports.toggle = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "UPDATE tasks SET done = NOT done WHERE id = $1 RETURNING *",
    [id]
  );

  if (result.rows.length === 0) {
    return error(res, "not found", 404);
  }

  success(res, result.rows[0]);
};