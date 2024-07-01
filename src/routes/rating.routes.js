import {Router} from "express";
const router=Router();
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { deleteRating, ratingProducts, updateRating } from "../controllers/ratings.controllers.js";


router.route("/addRating/:productId").post(verifyJWT,ratingProducts)
router.route("/updateRating/:ratingId").post(verifyJWT,updateRating);
router.route("/deleteRating/:ratingId").delete(verifyJWT,deleteRating)

export default router;