const router = require("express").Router();

const {
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
} = require("../controllers/quotesController");

const verifyToken = require("../middleware/authMiddleware.js");

// Quotes
router.route("/get/all").get(getQuotes);
router.route("/get/random").get(getRandomQuote);
router.route("/create").post(createQuote);
router.route("/today/create").post(createTodaysQuote);
router.route("/update/:id").put(updateQuote);
router.route("/delete/:id").delete(deleteQuote);
router.route("/filter/").get(filterQuote);

// Favorite
router.route("/favorite/add/:id").post(verifyToken, addToFavorites);
router.route("/favorite").get(verifyToken, getFavorites);
router.route("/favorite/remove/:id").delete(verifyToken, removeFavorites);

module.exports = router;
