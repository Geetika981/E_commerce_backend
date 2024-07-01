import { addToCart, removeFromCart, totalCartPrice } from "../controllers/cart.controllers.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router=Router();

router.route('/totalCartPriceOfUser').get(verifyJWT,totalCartPrice);
router.route('/addToCart/:productId').post(verifyJWT,addToCart);
router.route('/removeFromCart/:productId').delete(verifyJWT,removeFromCart)

export default router;