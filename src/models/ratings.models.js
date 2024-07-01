import mongoose from "mongoose";
const ratingSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
      required: true,
      default: 5,
      enum: [1, 2, 3, 4, 5],
    },
  },
  { timestamps: true }
);
export const Rating = mongoose.model("Rating", ratingSchema);
