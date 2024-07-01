import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.models.js";

const verifyAuth=asyncHandler(async(req,res,next)=>{
    const user=await User.findById(req.user._id);
    if(user.isAdmin===false){
        throw new ApiError(401,"unauthorized access this is for admin only");
    }

    next();
})

export {verifyAuth};