const mongoose = require("mongoose");

const UserDataSchema = mongoose.Schema(
  {
    os: {
      type: String,
    },
    brand: {
      type: String,
    },
    model: {
      type: String,
    },
    os_version: {
      type: String,
    },
    app_start_at: {
      type: String,
    },
    country: {
      type: String,
    },
    location: {
      type: String,
    },
    fcm_token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserData", UserDataSchema);
