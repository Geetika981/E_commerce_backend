import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.models.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Cart } from "../models/cart.models.js";

const addProduct = asyncHandler(async (req, res) => {
  const { category, name, description, price, inStock, images } = req.body;
  if (!category || !name || !description || !price || !inStock || !images) {
    throw new ApiError(400, "all fields are required");
  }
  const product = await Product.create({
    category,
    name,
    description,
    price,
    inStock,
    images,
    owner: req.user._id,
  });
  if (!product) {
    throw new ApiError(500, "internal error while listing product");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, product, "product created successfully"));
});

const removeProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!isValidObjectId(productId)) {
    throw new ApiError(400, "invalid product id");
  }
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(400, "product with this id does not exists");
  }
  const deletedProduct = await Product.findByIdAndDelete(productId);
  if (!deletedProduct) {
    throw new ApiError(500, "internal error in deleting product");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "product deleted successfully"));
});

const getAllProducts = asyncHandler(async (req, res) => {
  const productList = await Product.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user._id),
      },
    },
  ]);
  if (productList.length === 0) {
    throw new ApiError(400, "no listed product yet");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, productList, "product list fetched successfully")
    );
});

const soldProducts = asyncHandler(async (req, res) => {
  const productSold = await Cart.aggregate([
    {
      $match: {
        productOwnedBy: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "Product",
        localField: "product",
        forignField: "_id",
        as: "product",
        pipeline: [
          {
            $project: {
              name: 1,
              category: 1,
              price: 1,
            },
          },
        ],
      },
    },
  ]);
  if (productSold.length === 0) {
    throw new ApiError(400, "no products are sold yet");
  }
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        length: productSold.length,
        products: productSold,
      },
      "all sold products are fetched successfully"
    )
  );
});

const getProductReviews = asyncHandler(async (req, res) => {
  const ratings = await Product.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "Rating",
        localField: "_id",
        foreignField: "product",
        as: "avgRating",
        pipeline: [
          {
            $group: {
              _id:"rating",
              $avg: "$rating",
            },
          },
        ],
      },
    },
  ]);
});

export { addProduct, removeProduct, getAllProducts, soldProducts,getProductReviews };
