import {
  addProduct,
  removeProduct,
  getAllProducts,
  soldProducts,
} from "../controllers/product.controllers.js";
import {verifyJWT} from "../middlewares/auth.middlewares.js";
import { verifyAuth } from "../middlewares/adminAuth.middlewares.js";

import { Router } from "express";

const router=Router();

router.route('/addProduct').post(verifyJWT,verifyAuth,addProduct);
router.route('/removeProduct/:productId').delete(verifyJWT,verifyAuth,removeProduct);
router.route('/productList').get(verifyJWT,verifyAuth,getAllProducts);
router.route('/totalSoldProducts').get(verifyJWT,verifyAuth,soldProducts);

export default router;