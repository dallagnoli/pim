exports.isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

exports.isBoolean = (value) => typeof value === "boolean";

exports.isValidUrl = (value) => {
  if (!exports.isNonEmptyString(value)) return false;

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};
