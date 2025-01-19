import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    console.log("User: " + req.user);
    console.log("Body: " + req.body);

    const tweet = await Tweet.create({
        content: content.trim(),
        owner: req.user._id,
    });

    const createdTweet = await Tweet.findById(tweet._id).select("-__v").populate("owner", "email fullName username");

    if (!createdTweet) {
        throw new ApiError(500, "Tweet creation failed");
    }

    return res.status(201).json(
        new ApiResponse(200, createdTweet, "Tweet has been created successfully")
    );
});

const getAllTweets = asyncHandler(async (req, res) => {
    const { query = "", sortBy = "createdAt", sortType = "desc", userId } = req.query;

    // Build filter for the query
    const filter = {};
    if (query) {
        filter.content = { $regex: query, $options: "i" };
    }
    if (userId) {
        filter.owner = userId;
    }

    // Validate sortType
    const sortOrder = sortType.toLowerCase() === "desc" ? -1 : 1;

    try {
        // Fetch tweets with sorting and populate owner details
        const tweets = await Tweet.find(filter)
            .sort({ [sortBy]: sortOrder })
            .populate("owner", "email fullName username");

        return res.status(200).json(
            new ApiResponse(200, tweets, "Tweets fetched successfully")
        );
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Failed to fetch tweets. Please try again later");
    }
});

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { sortBy = "createdAt", sortType = "desc" } = req.query;

    if (!userId) {
        throw new ApiError(400, "User ID is required.");
    }

    const filter = { owner: userId };
    const sortOptions = { [sortBy]: sortType === "desc" ? -1 : 1 };

    try {
        // Fetch tweets with sorting
        const tweets = await Tweet.find(filter)
            .sort(sortOptions)
            .populate("owner", "username email fullName");

        // Total count of tweets (useful for pagination or display purposes)
        const totalTweets = await Tweet.countDocuments(filter);

        return res.status(200).json(
            new ApiResponse(200, { tweets, totalTweets }, "User's tweets fetched successfully.")
        );
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Failed to fetch user's tweets. Please try again later.");
    }
});


const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params;
    
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
    getAllTweets
}
