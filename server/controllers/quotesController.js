const asyncHandler = require("express-async-handler");
const Quote = require("../model/quotesSchema");
const User = require("../model/userSchema");
const jwt = require("jsonwebtoken");
const { createError } = require("../middleware/errorHandler");
const admin = require("../config/firebase-admin.js");

// @desc     Get Quotes
// @route    GET /api/Quote
// @access   Public
const getQuotes = asyncHandler(async (req, res, next) => {
  try {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 25;
    const skip = (page - 1) * limit;

    const authHeader = req.headers.authorization;
    let userID;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { id } = decoded;
      userID = id;
    }

    let qoutes;
    if (userID) {
      qoutes = await Quote.find().skip(skip).limit(limit);
      qoutes = qoutes.map((quote) => {
        return { ...quote.toJSON() };
      });
    } else {
      qoutes = await Quote.find({}, { isUserFavorite: 0 })
        .skip(skip)
        .limit(limit);
    }

    return res.status(200).json({
      status: true,
      code: 200,
      results: qoutes.length,
      message: "All the Quote is here",
      data: qoutes,
    });
  } catch (error) {
    next(error);
  }
});

const getRandomQuote = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  let userID = null;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded;
    userID = id;
  }

  let qoutes = await Quote.aggregate([{ $sample: { size: 1 } }]);

  return res.status(200).json({
    status: true,
    code: 200,
    message: "Random quote is here",
    data: qoutes,
  });
});

// @desc     Set Quotes`
// @route    POST /api/Quote
// @access   Private
const createQuote = asyncHandler(async (req, res, next) => {
  // Gettinf data from the body
  const { quote, video_link, date } = req.body;

  // Checking if the text field is empty or not
  if (!quote || !video_link || !date) {
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: "req body is empty, All field is required",
    });
  }

  try {
    // Creating Quote from req.body.quote
    const data = await Quote.create({
      quote,
      video_link,
      date,
    });

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Quote Created Successfully",
      quote: data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      Message: "Internal Server error",
    });
  }
});
// @desc     Set Quotes`
// @route    POST /api/Quote
// @access   Private
const createTodaysQuote = asyncHandler(async (req, res, next) => {
  // Gettinf data from the body
  const { quote, video_link, date } = req.body;

  // Checking if the text field is empty or not
  if (!quote || !video_link || !date) {
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: "req body is empty, All field is required",
    });
  }

  try {
    // Creating Quote from req.body.quote
    const data = await Quote.create({
      quote,
      video_link,
      date,
    });
    if (data) {
      const topic = process.env.FCM_TOPIC;

      const message = {
        notification: {
          title: "Today's quote",
          body: quote,
        },
        topic: topic,
      };

      // Send a message to devices subscribed to the provided topic.
      admin
        .messaging()
        .send(message)
        .then((response) => {
          // Response is a message ID string.
          console.log("Successfully sent message:", response);
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });
    }

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Quote Created Successfully",
      quote: data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      Message: "Internal Server error",
    });
  }
});

// @desc     Update Quotes
// @route    PUT /api/Quote:id
// @access   Private
const updateQuote = asyncHandler(async (req, res, next) => {
  // Getting document id from URL
  const id = req.params.id;

  // Finding quote in DB
  const quote = await Quote.findById(id);

  // Checking if the Quote that user wants to upate exists or not!
  if (!quote) {
    res.status(401).json({
      status: false,
      statusCode: 401,
      message: `${id} Not Found`,
    });
  }

  try {
    // Updating Quote
    const updatedQuote = await Quote.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: `${req.params.id} Updated Successfully`,
      updatedQuote,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      Message: "Internal Server Error",
    });
  }
});

// @desc     Delete Quotesreq, res,next)
// @route    DELETE /api/Quote
// @access   Private
const deleteQuote = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const quote = await Quote.findById(id);
  // Checking if the Quote that user wants to upate exists or not!
  if (!quote) {
    return res.status(401).json({
      status: false,
      statusCode: 401,
      Message: "Quote Not Found",
    });
  }
  try {
    // Deleting Quote
    const deletedQuote = await Quote.findByIdAndDelete(id);

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: `${id} has been deleted`,
      deletedQuote,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      Message: "Internal Server Error",
    });
  }
});

const filterQuote = asyncHandler(async (req, res, next) => {
  try {
    const { search, sort } = req.query;
    const queryObject = {};

    let api_query_W_Auth = Quote.find(queryObject);

    if (search) {
      api_query_W_Auth = Quote.find({
        $or: [
          { quote: { $regex: search, $options: "i" } },
          { date: { $regex: search, $options: "i" } },
        ],
        ...queryObject,
      });
    }
    if (sort === "oldest") {
      api_query_W_Auth = api_query_W_Auth.sort("-date");
    }

    if (sort === "newest") {
      api_query_W_Auth = api_query_W_Auth.sort("date");
    }
    console.log(queryObject);

    const authHeader = req.headers.authorization;
    let userID;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { id } = decoded;
      userID = id;
    }

    let quotes;

    if (userID) {
      const user = await User.findById(userID).populate("favorites");

      quotes = await api_query_W_Auth;
      quotes = quotes.map((quote) => {
        const isUserFavorite = user.favorites.some((favorite) =>
          favorite._id.equals(quote._id)
        );
        return { ...quote.toJSON(), isUserFavorite };
      });
    } else {
      let api_query_WO_Auth = Quote.find(queryObject, { isUserFavorite: 0 });

      if (search) {
        api_query_WO_Auth = Quote.find({
          $or: [
            { quote: { $regex: search, $options: "i" } },
            { date: { $regex: search, $options: "i" } },
          ],
          ...queryObject,
        });
      }

      if (sort === "lazyVerified") {
        queryObject.isLazyVerified = true;
      }

      if (sort === "popular") {
        api_query_WO_Auth = api_query_WO_Auth.sort("-popularity");
      }

      if (sort === "newlyAdded") {
        api_query_WO_Auth = api_query_WO_Auth.sort("-createdAt");
      }
      quotes = await api_query_WO_Auth;
    }

    return res.status(200).json(response(quotes, "All the quote is here"));
  } catch (error) {
    next(error);
  }
});
// @desc     Add Quotes to favorite
// @route    POST api/quotes/favorite/add/:id
// @access   Private
const addToFavorites = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    const favorite = await Quote.findById(id);
    if (!favorite) {
      return res
        .status(404)

        .json(next(createError(404, "No Favorite Found for this ID!")));
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.favorites.includes(id)) {
      await user.favorites.push(id);
      await user.save();
      await Quote.findByIdAndUpdate(
        id,
        { isUserFavorite: true },
        { new: true }
      );
    } else {
      return res
        .status(201)
        .json(response("this AI is already your favorite", null));
    }

    const quote = await Quote.findById(id);
    const favoriteDoc = await quote.save();
    res.status(200).json(response(favoriteDoc, `This quote is Your Favorite`));
  } catch (error) {
    next(error);
  }
});

const getFavorites = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    // console.log(user);
    const userFavorites = user.favorites;

    const list = await Promise.all(
      userFavorites.map(async (favoriteId) => {
        return await Quote.findById(favoriteId);
      })
    );
    console.log(list);
    res.status(200).json(
      response(
        list.flat().sort((a, b) => b.createdAt - a.createdAt),
        "Your Favorites"
      )
    );
  } catch (error) {
    next(error);
  }
});

const removeFavorites = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return next(createError(404, "User not found"));

    const quote = await Quote.findById(req.params.id);

    if (!quote) return next(createError(404, "Quote not found"));

    // Verify that the quote is in the user's favorites array
    const isFavorite = user.favorites.includes(req.params.id);
    if (!isFavorite) return next(createError(404, "Favorite Not Found"));

    // Remove the quote from the user's favorites array
    if (isFavorite) {
      user.favorites = user.favorites.filter(
        (favoriteId) => favoriteId.toString() !== req.params.id
      );

      try {
        await Quote.findByIdAndUpdate(req.params.id, {
          isUserFavorite: false,
        });
      } catch (error) {
        next(error);
      }
    }

    await user.save();

    res.status(200).json({
      status: true,
      code: 200,
      message: "Favorite Removed Successfully.",
    });
  } catch (error) {
    next(error);
  }
});

function response(data, text) {
  const reqOfResponse = {
    status: true,
    code: 200,
    results: data.length,
    message: text,
    data: data === null ? null : data,
  };

  return reqOfResponse;
}

module.exports = {
  getQuotes,
  getRandomQuote,
  createQuote,
  createTodaysQuote,
  updateQuote,
  deleteQuote,
  addToFavorites,
  getFavorites,
  removeFavorites,
  filterQuote,
};
