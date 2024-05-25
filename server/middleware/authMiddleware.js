const jwt = require("jsonwebtoken");
const { createError } = require("./errorHandler");
const User = require("../model/userSchema");

const verifyToken = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) return next(createError(404, "No Id found in token"));

      // Get user from the token
      req.user = await User.findById(decoded.id);

      if (!req.user.id) return next(createError(404, "No Id in token"));

      next();
    } catch (error) {
      next(error);
    }
  }

  if (!token) return next(createError(404, "No Token, No Authorization"));
};

module.exports = verifyToken;
