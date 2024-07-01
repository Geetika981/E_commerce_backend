import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { Product } from "../models/product.models.js";
import { Rating } from "../models/ratings.models.js";

const ratingProducts = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating } = req.body;

  if (!isValidObjectId(productId)) {
    throw new ApiError(400, "invalid product id");
  }
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(400, "invalid product id");
  }
  const ratingProduct = await Rating.create({
    product: productId,
    owner: ownerId,
    rating: rating,
  });
  if (!ratingProduct) {
    throw new ApiError(500, "INTERNAL ERRROR IN GENERATING RATING");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, ratingProduct, "rated product successfully"));
});

const updateRating = asyncHandler(async (req, res) => {
  const { ratingId } = req.params;
  const { rating } = req.body;

  if (!isValidObjectId(ratingId)) {
    throw new ApiError(400, "invalid product id");
  }
  const ratings = await Rating.findById(ratingId);
  if (!ratings) {
    throw new ApiError(400, "invalid rating id");
  }
  const ratingProduct = await Rating.findByIdAndUpdate(
    ratingId,
    {
      $set: {
        rating: rating,
      },
    },
    {
      new: true,
    }
  );
  if (!ratingProduct) {
    throw new ApiError(500, "INTERNAL ERRROR IN updating RATING");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, ratingProduct, "rated product updated successfully")
    );
});

const deleteRating = asyncHandler(async (req, res) => {
  const { ratingId } = req.params;
  if (!isValidObjectId(ratingId)) {
    throw new ApiError(400, "invalid product id");
  }
  const ratings = await Rating.findById(ratingId);
  if (!ratings) {
    throw new ApiError(400, "invalid rating id");
  }
  const rating = await Rating.findByIdAndDelete(ratingId);
  if (!rating) {
    throw new ApiError(500, "internal error in deleting your rating");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "rating deleted successfully"));
});

export { ratingProducts, updateRating, deleteRating };
