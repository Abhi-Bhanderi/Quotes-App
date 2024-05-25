const express = require("express");
const router = express.Router();

const addUserData = require("../controllers/userDataController");

router.route("/addData").post(addUserData);

module.exports = router;
