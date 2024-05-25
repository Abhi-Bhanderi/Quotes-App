const mongoose = require("mongoose");

const QuotesSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  quote: {
    type: String,
    required: [true, "Quote must be Provided"],
  },
  author: {
    type: String,
    required: [true, "Author must be Provided"],
  },
  aboutAuthot: {
    type: String,
    required: [true, "About Author must be Provided"],
  },
  isUserFavorite: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Quote", QuotesSchema);
