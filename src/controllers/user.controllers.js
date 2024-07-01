import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, isAdmin, location } = req.body;

  // if (!username || !email || !password || !isAdmin || !location) {
  //   throw new ApiError(400, "all fields are required");
  // }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(400, "username or email already exists ");
  }

  if (password.length < 8) {
    throw new ApiError(400, "password must be of 8 characters length");
  }
  if (!email.includes("@")) {
    throw new ApiError(400, "enter a valid email id");
  }

  const user = await User.create({
    username,
    email,
    password,
    isAdmin,
    location,
  });
  if (!user) {
    throw new ApiError(500, "internal error while registering user");
  }
  const registeredUser = await User.findById(user._id);
  if (!registeredUser) {
    throw new ApiError(500, "internal error while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, registeredUser, "user registered successfully"));
});

const generateAccessTokenAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(400, "invalid credentials");
  }
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ApiError(400, "all fieds are required");
  }
  const user = await User.findOne({
    username,
  });
  if (!user) {
    throw new ApiError(400, "user does not exists");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "invalid credentials");
  }
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "user logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const option = {
    httpOnly: true,
    secure: true,
  };
  const user = await User.findById(req.user?._id);
  user.refreshToken = undefined;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "user logout successfully"));
});

const updateUserInfo = asyncHandler(async (req, res) => {
  const { username, location } = req.body;
  // const user=await User.findById(user._id);
  if (!username && !location) {
    throw new ApiError(400, "atleast one field is required");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        username,
        location,
      },
    },
    {
      new: true,
    }
  );
  if (!user) {
    throw new ApiError(500, "internal eror in updating user info");
  }

  const updatedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "user updated successfully"));
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, user, "user fetched successfully"));
});

const deleteAccount=asyncHandler(async(req,res)=>{
  const user=await User.findByIdAndDelete(req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "account deleted successfully"));

})
export { loginUser, registerUser, updateUserInfo, logoutUser, getUser,deleteAccount };
