import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Review } from "../models/review.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createReview = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { productId } = req.params;
  if (!isValidObjectId(productId)) {
    throw new ApiError(400, "invalid product id");
  }
  const newReview = await Review.create({
    owner: req.user._id,
    product: productId,
    content: content,
  });
  if (!newReview) {
    throw new ApiError(500, "internal eror while creating new review");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, newReview, "review cretaed successfully"));
});

const updateReview=asyncHandler(async(req,res)=>{
  const { content } = req.body;
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "invalid comment id");
  }
  const updatedReview = await Review.findByIdAndUpdate(commentId,{
    $set:{
      content:content
    }
  },{
    new:true
  });
  if (!updatedReview) {
    throw new ApiError(500, "internal eror while updating review");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedReview, "review updated successfully"));
});

const deleteReview=asyncHandler(async(req,res)=>{
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "invalid comment id");
  }
  const deletedReview = await Review.findByIdAndDelete(commentId);
  if (!deletedReview) {
    throw new ApiError(500, "internal eror while deleting review");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "review deleted successfully"));
})

const readAllReviewOfProduct=asyncHandler(async(req,res)=>{
  const {productId}=req.params;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "invalid comment id");
  }
  const allReviews=await mongoose.aggregate([
    {
      $match:{
        product:new mongoose.Types.ObjectId(productId)
      }
    },{
      $lookup:{
        from :"User",
        localField:"owner",
        foreignField:"_id",
        as:"user",
        pipeline:[
          {
            username:1
          }
        ]
      }
    }
  ])
  if(allReviews.length===0){
    throw new ApiError(400,"no reviews on this product yet");
  }
  return res.status(200).json(new ApiResponse(200,allReviews,"all reviews atre fetched successfully"));
});

export { createReview,updateReview,deleteReview,readAllReviewOfProduct };
