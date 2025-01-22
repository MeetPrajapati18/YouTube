import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const { email, username, password } = req.body
  console.log(email);

  if (!username && !email) {
    throw new ApiError(400, "username or email is required")
  }
  // Here is an alternative of above code based on logic discussed in video:
  // if (!(username || email)) {
  //     throw new ApiError(400, "username or email is required")

  // }

  const user = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (!user) {
    throw new ApiError(404, "User does not exist")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

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
});

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

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password.");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password has been changed successfully."));
});

const getCurentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User details fetched successfully."));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "Full name or email is required.");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName,
        email: email
      }
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully."));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required.");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(500, "Failed to upload avatar image to Cloudinary.");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url
      }
    },
    {
      new: true
    }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile image updated successfully."));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Avatar image is required.");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(500, "Failed to upload cover image to Cloudinary.");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url
      }
    },
    {
      new: true
    }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "cover image updated successfully."));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  // console.log("Fetching profile for:", req.params.username); // Debugging
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "Username is required.");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase()
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
      }
    }, {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo"
      }
    }, {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers"
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo"
        },
        isSubscribed: {
          $cond: {
            if: {
              $in: [req.user?._id, "$subscribers.subscriber"]
            },
            then: true,
            else: false
          }
        }
      }
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1
      }
    }
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "Channel not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200, channel[0], "Channel profile fetched successfully."
      ));
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1
                  }
                }
              ]
            }
          },
          {
            $addFields: {
              owner: {
                $first: "$owner"
              }
            }
          }
        ]
      }
    }
  ])

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "Watch history fetched successfully"
      )
    )
});

/**
 * document : One Channel name and One Subscriber name
 * if you want to count the subscriber of the channel then select the documents where channel is that one.
 * if you want to know how many channels one user has subscribed then select the documents where subscriber is that one.
 */

export {
  registerUser,
  loginUser,
  logoutUser,
  refereshAccessToken,
  changeCurrentPassword,
  getCurentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory
};