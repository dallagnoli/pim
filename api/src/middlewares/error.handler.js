module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err);

  const status = err.statusCode || 500;
  const message = err.message || "internal error";

  res.status(status).json({ error: message });
};
