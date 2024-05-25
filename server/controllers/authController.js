const User = require("../model/userSchema");
const jwt = require("jsonwebtoken");
const Data = require("../model/quotesSchema");

const google = async (req, res, next) => {
  try {
    const isUserExists = await User.findOne({ email: req.body.email });

    if (isUserExists) {
      const token = jwt.sign({ id: isUserExists._id }, process.env.JWT_SECRET);
      try {
        await Data.updateMany(
          {},
          {
            userId: isUserExists._id,
          },
          { multi: true }
        );
      } catch (error) {
        next(error);
      }

      res.status(200).json({
        status: true,
        message: "logged in Successfully!!",
        user: isUserExists,
        token,
      });
    } else {
      const newUser = new User({ ...req.body, fromGoogle: true });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      try {
        await Data.updateMany(
          {},
          {
            userId: newUser._id,
          },
          { multi: true }
        );
      } catch (error) {
        next(error);
      }
      res.status(201).json({
        status: true,
        message: "logged in Successfully!!",
        user: newUser,
        token,
      });
    }
  } catch (err) {
    next(err);
  }
};

function response(message, data) {
  const responseData = {
    status: true,
    code: 200,
    message,
    data,
  };
  if (responseData.data === null) {
    delete responseData.data;
  }
  return responseData;
}

module.exports = google;
