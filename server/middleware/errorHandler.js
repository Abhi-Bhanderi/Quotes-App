const defaultError = (err, req, res, next) => {
  const code = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(code).json({
    success: false,
    code,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

const createError = (code, message) => {
  const err = new Error();
  err.status = false;
  err.code = code;
  err.message = message;
  err.stack = process.env.NODE_ENV === "development" ? err.stack : null;
  return err;
};

module.exports = {
  defaultError,
  createError,
};
