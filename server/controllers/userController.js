const User = require("../model/userSchema");

const getCertainUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCertainUser };
