const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "User Name is Required."],
    },
    email: {
      type: String,
      required: [true, "User Email is Required."],
      unique: [true, "Provide Different Email."],
    },
    imageURL: {
      type: String,
      required: [true, "Image URL is Required."],
      // unique: [true, "Provide Different Image."],
    },
    favorites: {
      type: [String],
      default: [],
    },
    fromGoogle: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
