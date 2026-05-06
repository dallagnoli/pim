const { error } = require("../utils/response");

exports.validateNoteInput = (req, res, next) => {
  const { title, content } = req.body;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return error(res, "title is required and must be non-empty", 400);
  }

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return error(res, "content is required and must be non-empty", 400);
  }

  next();
};

exports.validateIdeaInput = (req, res, next) => {
  const { content } = req.body;

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return error(res, "content is required and must be non-empty", 400);
  }

  next();
};

exports.validateLinkInput = (req, res, next) => {
  const { title, url } = req.body;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return error(res, "title is required and must be non-empty", 400);
  }

  if (!url || typeof url !== "string" || url.trim().length === 0) {
    return error(res, "url is required and must be non-empty", 400);
  }

  try {
    new URL(url);
  } catch {
    return error(res, "url must be valid", 400);
  }

  next();
};

exports.validateTaskInput = (req, res, next) => {
  const { title, done } = req.body;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return error(res, "title is required and must be non-empty", 400);
  }

  if (done !== undefined && typeof done !== "boolean") {
    return error(res, "done must be boolean", 400);
  }

  next();
};
