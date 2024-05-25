const asyncHandler = require("express-async-handler");
const UserData = require("../model/userDataSchema");

// @desc     Set UserDatas
// @route    POST /api/UserData
// @access   Private
const addUserData = asyncHandler(async (req, res) => {
  const {
    os,
    brand,
    model,
    os_version,
    app_start_at,
    country,
    location,
    fcm_token,
  } = req.body;
  try {
    // Creating UserData from req.body.text
    const data = await UserData.create({
      os: os,
      brand: brand,
      model: model,
      os_version: os_version,
      app_start_at: app_start_at,
      country: country,
      location: location,
      fcm_token: fcm_token,
    });

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "UserData Added Successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Somthing went Wrong",
      error,
    });
  }
});

module.exports = addUserData;
