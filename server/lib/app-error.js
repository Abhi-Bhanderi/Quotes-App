export default class AppError extends Error {
  constructor(statusCode, message) {
    super(message);

    this.code = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
