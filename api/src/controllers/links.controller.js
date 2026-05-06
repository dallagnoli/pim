const pool = require("../db/pool");
const { created, success, deleted, error } = require("../utils/response");

exports.getAll = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM links ORDER BY created_at DESC"
  );
  success(res, result.rows);
};

exports.create = async (req, res) => {
  const { title, url } = req.body;

  const result = await pool.query(
    "INSERT INTO links (title, url, created_at) VALUES ($1, $2, NOW()) RETURNING *",
    [title, url]
  );

  created(res, result.rows[0]);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { title, url } = req.body;

  const result = await pool.query(
    `UPDATE links
     SET title = $1,
         url = $2
     WHERE id = $3
     RETURNING *`,
    [title, url, id]
  );

  if (result.rows.length === 0) {
    return error(res, "not found", 404);
  }

  success(res, result.rows[0]);
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "DELETE FROM links WHERE id = $1 RETURNING *",
    [id]
  );

  if (result.rows.length === 0) {
    return error(res, "not found", 404);
  }

  deleted(res);
};