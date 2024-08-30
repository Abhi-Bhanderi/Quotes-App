import User from "../model/user-model.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import AppError from "../lib/app-error.js";

export const signInWithGoogle = asyncHandler(async (req, res, next) => {
  const exsistingUser = await User.findOne({ email: req.body.email });

  if (exsistingUser) {
    const accessToken = generateAccessToken(exsistingUser._id);
    const refreshToken = generateRefreshToken(exsistingUser._id);

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Logged in!",
      data: { user: exsistingUser, accessToken, refreshToken },
    });
  }

  const newUser = await User.create(req.body);

  if (!newUser)
    return next(new AppError(400, "Somthing went wrong while creating user."));

  const newUserAccessToken = generateAccessToken(newUser._id);
  const newUserRefreshToken = generateRefreshToken(newUser._id);

  return res.status(200).json({
    status: true,
    code: 200,
    message: "Account created successfully",
    data: {
      user: newUser,
      accessToken: newUserAccessToken,
      refreshToken: newUserRefreshToken,
    },
  });
});

export const refreshToken = (req, res, next) => {
  if (!req.body.refreshToken)
    return next(new AppError(404, "Refresh token not found."));

  jwt.verify(
    req.body.refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return next(new AppError(403, "Forbidden"));

      const foundUser = await User.findById(decoded.userId);

      if (!foundUser) return next(new AppError(401, "Unauthorized"));

      const accessToken = generateAccessToken(foundUser._id);

      res.status(200).json({ accessToken });
    })
  );
};

function generateAccessToken(id) {
  return jwt.sign({ userId: id }, process.env.SECRET_ACCESS_TOKEN, {
    expiresIn: "15min",
  });
}
function generateRefreshToken(id) {
  return jwt.sign({ userId: id }, process.env.SECRET_REFRESH_TOKEN, {
    expiresIn: "7d",
  });
}
