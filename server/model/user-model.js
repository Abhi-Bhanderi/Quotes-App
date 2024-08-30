import mongoose from "mongoose";

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
    favorites: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Quote", default: [] },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
