import { Router } from "express";
const router = Router();
import {
  createReview,
  updateReview,
  deleteReview,
  readAllReviewOfProduct,
} from "../controllers/review.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

router.route("/createReview").post(verifyJWT, createReview);
router.route("/update/:commentId").patch(verifyJWT, updateReview);
router.route("/delete/:commentId").delete(verifyJWT, deleteReview);
router.route("/:productId").get(verifyJWT, readAllReviewOfProduct);

export default router;
