import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Access token from cookies (accessToken) or Authorization header (Bearer token)
        const token = req.cookies?.accessToken || req.headers['authorization']?.replace("Bearer ", "");

        // Debug log: Print token for debugging
        // console.log("Token received:", token);

        if (!token) {
            throw new ApiError(401, "Unauthorized request.");
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find user associated with the decoded token
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid access token.");
        }

        // Attach the user to the request object for use in subsequent routes
        req.user = user;
        next();
    } catch (error) {
        // Handle token verification errors
        console.error("Token verification error:", error.message);  // Log any errors
        throw new ApiError(401, error?.message || "Invalid access token.");
    }
});

