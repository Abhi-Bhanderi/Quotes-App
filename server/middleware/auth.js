import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import AppError from "../lib/app-error.js";

export const StrictlyProtected = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return next(new AppError(401, "Unauthorized"));

  // Get token from header
  let token = req.headers.authorization.split(" ")[1];

  // Verify token
  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, decoded) => {
    if (err) return next(new AppError(403, "Forbidden"));

    req.userId = decoded.userId;
  });
  next();
});

export const UnStrictlyProtected = async (req, res, next) => {
  // Retrieve token from the header
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (token == null) {
    req.isAuth = false;
    return next();
  }

  jwt.verify(
    token,
    process.env.SECRET_ACCESS_TOKEN,
    asyncHandler((err, decoded) => {
      if (err) {
        req.isAuth = false;
      } else {
        req.isAuth = true;

        req.userId = decoded.userId;
      }
      next();
    })
  );
};
