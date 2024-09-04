import asyncHandler from "express-async-handler";
import AppError from "../lib/app-error.js";
import Quote from "../model/quotes-model.js";
import User from "../model/user-model.js";

export const getQuotes = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const skip = (page - 1) * limit * 1;

  let queryObj = {};

  if (search) {
    queryObj = {
      $or: [
        { quote: { $regex: search, $options: "i" } },
        { date: { $regex: search, $options: "i" } },
      ],
    };
  }

  const quotes = await Quote.find(queryObj).skip(skip).limit(limit);

  if (!req.isAuth) {
    return res.status(200).json({
      status: true,
      code: 200,
      results: quotes.length,
      data: quotes,
    });
  }

  const userId = req.userId;

  const user = await User.findById(userId).populate("favorites");

  const favoritesIds = new Set(user.favorites.map((u) => u._id.toString()));

  const quotesWithFav = quotes.map((q) => ({
    ...q._doc,
    isUserFavorite: favoritesIds.has(q._id.toString()),
  }));

  return res.status(200).json({
    status: true,
    code: 200,
    results: quotesWithFav.length,
    data: quotesWithFav,
  });
});

export const getRandomQuote = asyncHandler(async (req, res) => {
  let qoutes = await Quote.aggregate([{ $sample: { size: 1 } }]);

  return res.status(200).json({
    status: true,
    code: 200,
    message: "Random quote is here",
    data: { quotes: qoutes[0] },
  });
});

export const createSingleQuote = asyncHandler(async (req, res, next) => {
  if (!req.body) return next(new AppError(404, "Quote not found!"));

  let qoute = await Quote.create(req.body);

  return res.status(200).json({
    status: true,
    code: 200,
    data: { quotes: qoute },
  });
});

export const createMany = asyncHandler(async (req, res, next) => {
  if (!req.body) return next(new AppError(404, "Quotes not found!"));

  let qoutes = await Quote.insertMany(req.body);

  return res.status(200).json({
    status: true,
    code: 200,
    data: { qoutes },
  });
});

export const addFavorite = asyncHandler(async (req, res, next) => {
  const quoteId = req.params.id;
  const userId = req.userId;

  if (!userId) return next(new AppError(401, "You are Unauthenticated!"));

  const user = await User.findById(userId);

  if (!user)
    return next(new AppError(404, "No user found with the provided user Id"));

  if (user.favorites.includes(quoteId))
    return next(
      new AppError(400, "This quote is already in your favorites list.")
    );

  const userWithFavQuotes = await User.findByIdAndUpdate(userId, {
    $push: { favorites: quoteId },
  });

  if (!userWithFavQuotes)
    return next(
      new AppError(400, "Somthing went wrong while adding the favrite.")
    );

  return res.status(204).json({
    status: true,
    code: 200,
    data: { user: userWithFavQuotes },
  });
});

export const getFavorites = asyncHandler(async (req, res, next) => {
  const userId = req.userId;

  if (!userId) return next(new AppError(401, "You are Unauthenticated!"));

  const user = await User.findById(userId).populate("favorites");

  if (!user)
    return next(new AppError(404, "No user found with the provided user Id"));

  return res.status(200).json({
    status: true,
    code: 200,
    data: { user },
  });
});

export const removeFavorite = asyncHandler(async (req, res, next) => {
  const quoteId = req.params.id;
  const userId = req.userId;

  if (!userId) return next(new AppError(401, "You are Unauthenticated!"));

  const user = await User.findById(userId);

  if (!user)
    return next(new AppError(404, "No user found with the provided user Id"));

  if (!user.favorites.includes(quoteId))
    return next(
      new AppError(
        400,
        "There are no quote with the provided Id in your favorites"
      )
    );

  const userWithRemovedFav = await User.findByIdAndUpdate(userId, {
    $pull: { favorites: quoteId },
  });

  if (!userWithRemovedFav)
    return next(
      new AppError(400, "Somthing went wrong while adding the favrite.")
    );

  return res.status(204).json({
    status: true,
    code: 200,
    data: { user: userWithRemovedFav },
  });
});
