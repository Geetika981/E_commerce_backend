import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { Cart } from "../models/cart.models.js";
import { Product } from "../models/product.models.js";

const addToCart = asyncHandler(async (req, res) => {
  const { productId } = req.params();
  if (!isValidObjectId(productId)) {
    throw new ApiError(400, "invalid product Id");
  }
  const { number } = req.query();
  const product = await Cart.findOne({
    owner: req.user._id,
    product: productId,
  });
  if (product) {
    const prvs = product.number;
    const updatedCart = await Cart.findByIdAndUpdate(product._id, {
      $set: {
        number: prvs + number,
      },
    });
    if (!updatedCart) {
      throw new ApiError(
        500,
        "internal error while adding produxt to the cart"
      );
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedCart,
          "product added successfully to the cart"
        )
      );
  }
  const productOwner=await Product.findById(productId);
  const newProduct = await Cart.create({
    owner: req.user._id,
    product: productId,
    number: number,
    productOwnedBy:productOwner.owner
  });

  if (!newProduct) {
    throw new ApiError(500, "internal error while adding produxt to the cart");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, newProduct, "product added successfully to the cart")
    );
});

const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params();
  if (!isValidObjectId(productId)) {
    throw new ApiError(400, "invalid product Id");
  }
  const product = await Cart.findOneAndDelete({
    owner: req.user._id,
    product: productId,
  });
  if (!product) {
    throw new ApiError(
      500,
      "internal error while deleting product from the cart"
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "product deleted successfully from the cart")
    );
});

const totalCartPrice = asyncHandler(async (req, res) => {
  const price = await Cart.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productPrice",
        pipeline: [
          {
            $project: {
              price: 1,
            },
          },
        ],
      },
    },
    {
      $group: {
        _id: null,
        totalPrice: {
          $sum: "$productPrice * $number",
        },
      },
    },
  ]);
});

export { addToCart, removeFromCart, totalCartPrice };
