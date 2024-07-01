import mongoose from "mongoose";
const cartSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    number: {
      type: Number,
      default: 1,
      required: true,
    },
    productOwnedBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",  
      required:true
    }
  },
  { timestamps: true }
);
export const Cart = mongoose.model("Cart", cartSchema);
