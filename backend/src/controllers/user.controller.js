import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  // Generate an access token for the user
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Update the user's refresh token in the database
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };

  } catch (error) {
    throw new ApiError(500, "Failed to generate access token.");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // Extract user details from request body
  const { fullName, email, username, password } = req.body;

  // Check for empty fields
  if (
    [fullName, email, username, password].some((field) => !field?.trim())
  ) {
    throw new ApiError(400, "Fields cannot be empty.");
  }

  // Check if a user already exists with the given username or email
  const existedUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
  });

  if (existedUser) {
    throw new ApiError(409, "A user with this email or username already exists.");
  }

  // Log request body and files for debugging
  console.log("Request Body:", req.body);
  console.log("Uploaded Files:", req.files);

  // Validate uploaded avatar and cover image
  if (!req.files?.avatar || req.files.avatar.length === 0) {
    throw new ApiError(400, "Avatar is required.");
  }

  const avatarLocalPath = req.files.avatar[0].path;

  // Check and set the optional cover image path
  const coverImageLocalPath =
    req.files.coverImage && req.files.coverImage.length > 0
      ? req.files.coverImage[0].path
      : null;

  // Upload avatar and cover image to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  // Ensure avatar was uploaded successfully
  if (!avatar?.url) {
    throw new ApiError(500, "Failed to upload avatar to Cloudinary.");
  }

  // Create the user document
  const user = await User.create({
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    username: username.trim().toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  // Fetch the created user without sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "User registration failed.");
  }

  // Respond with success
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User has been registered successfully.")
  );
});

// const loginUser = asyncHandler(async (req, res) => {
//   /**
//    * req body -> data
//    * username or email and password
//    * find the user
//    * password check
//    * generate access and refresh token
//    * send cookies
//    * send response 
//    */

//   // Extract user details from request body
//   const { email, password, username } = req.body;

//   // Check for empty fields
//   if (!email && !username) {
//     throw new ApiError(400, "Email or username and password are required.");
//   }

//   const user = await User.findOne({
//     $or: [{ username }, { email }]
//   })

//   if (!user) {
//     throw new ApiError(404, "User does not exist.");
//   }

//   // Check if the user exists and the password is correct
//   if (!user || !(await user.isPasswordCorrect(password))) {
//     throw new ApiError(401, "Invalid email or password.");
//   }

//   // Generate an access token for the user
//   // const accessToken = user.generateAccessToken();
//   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

//   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

//   const options = {
//     httpOnly: true,
//     secure: true
//   };

//   // Respond with success
//   return res
//     .status(200)
//     .cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", refreshToken, options)
//     .json(
//       new ApiResponse(200, {
//         user: loggedInUser,
//         accessToken,
//         refreshToken
//       },
//         "User logged in successfully."
//       )
//     );
// });

const loginUser = asyncHandler(async (req, res) =>{
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const {email, username, password} = req.body
  console.log(email);

  if (!username && !email) {
      throw new ApiError(400, "username or email is required")
  }
  
  // Here is an alternative of above code based on logic discussed in video:
  // if (!(username || email)) {
  //     throw new ApiError(400, "username or email is required")
      
  // }

  const user = await User.findOne({
      $or: [{username}, {email}]
  })

  if (!user) {
      throw new ApiError(404, "User does not exist")
  }

 const isPasswordValid = await user.isPasswordCorrect(password)

 if (!isPasswordValid) {
  throw new ApiError(401, "Invalid user credentials")
  }

 const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
      httpOnly: true,
      secure: true
  }

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
      new ApiResponse(
          200, 
          {
              user: loggedInUser, accessToken, refreshToken
          },
          "User logged In Successfully"
      )
  )
})

const logoutUser = asyncHandler(async (req, res) => {

  await User.findByIdAndUpdate(req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  );

  const options = {
    httpOnly: true,
    secure: true
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(200, {}, "User logged out successfully.")
    );
});

const refereshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.body.refreshToken || req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is missing.");
  }

  try {
    const decodedToke = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    )
  
    const user = await User.findById(decodedToke._id);
  
    if (!user) {
      throw new ApiError(401, "Invalid refresh token.");
    }
  
    if (user?.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Invalid or Expired or used refresh token.");
    }
  
    const options = {
      httpOnly: true,
      secure: true
    };
  
    const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);
  
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed successfully.")
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token.");
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refereshAccessToken
};