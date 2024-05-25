const router = require("express").Router();

const { getCertainUser } = require("../controllers/userController");

const verifyToken = require("../middleware/authMiddleware.js");

// Quotes
router.route("/get").get(verifyToken, getCertainUser);

module.exports = router;
