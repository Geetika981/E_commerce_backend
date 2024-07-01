import { Router } from "express";
import { loginUser, logoutUser, registerUser, updateUserInfo,getUser,deleteAccount } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router=Router();


router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(verifyJWT,logoutUser);
router.route('/updateUserInfo').patch(verifyJWT,updateUserInfo);
router.route('/getUser').get(verifyJWT,getUser);
router.route('/deleteAccount').delete(verifyJWT,deleteAccount);

export default router;