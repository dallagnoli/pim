exports.success = (res, data, status = 200) =>
  res.status(status).json({ data });

exports.created = (res, data) => exports.success(res, data, 201);

exports.deleted = (res) => res.status(204).send();

exports.error = (res, message, status = 500) =>
  res.status(status).json({ error: message });
