import mongoose from "mongoose";

const QuotesSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, "date must be Provided"],
    },
    video_link: {
      type: String,
      required: [true, "Link must be Provided"],
    },
    quote: {
      type: String,
      required: [true, "Quote must be Provided"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Quote", QuotesSchema);
