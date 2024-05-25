const express = require("express");
const router = express.Router();
const google = require("../controllers/authController");

//SIGN IN
router.post("/google", google);

//GOOGLE AUTH
// router.post("/google", googleAuth);

module.exports = router;
