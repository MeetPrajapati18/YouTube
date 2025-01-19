import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user.id;

    // Validate video ID and user ID
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        return res.status(400).json({ message: "Invalid video ID" });
    }
    if (!userId) {
        return res.status(400).json({ message: "User not authenticated" });
    }

    try {
        // Check if the user has already liked the video
        const existingLike = await Like.findOneAndDelete({ video: videoId, likedBy: userId });
        if (existingLike) {
            // Return the updated like count
            const likeCount = await Like.countDocuments({ video: videoId });
            return res.status(200).json({ message: "Video unliked successfully", likeCount });
        }

        // Create a new like
        const newLike = await Like.create({ video: videoId, likedBy: userId });

        // Return the updated like count
        const likeCount = await Like.countDocuments({ video: videoId });
        return res.status(200).json({ message: "Video liked successfully", likeCount });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

const getVideoLikeStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user.id;  // Assuming user ID is available in the request object

    // Check if the video exists
    const video = await Video.findById(videoId);
    if (!video) {
        return res.status(404).json({ message: "Video not found" });
    }

    // Check if the user has liked the video
    const existingLike = await Like.findOne({ video: videoId, likedBy: userId });

    // Respond with like status
    if (existingLike) {
        return res.status(200).json({ isLiked: true });
    } else {
        return res.status(200).json({ isLiked: false });
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id; // Get user ID from JWT token (assuming `req.user` is populated by middleware)

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json({ message: "Invalid comment ID" });
    }
    if (!userId) {
        return res.status(400).json({ message: "User not authenticated" });
    }

    try {
        // Check if the user has already liked the video
        const existingLike = await Like.findOneAndDelete({ comment: commentId, likedBy: userId });
        if (existingLike) {
            // Return the updated like count
            const likeCount = await Like.countDocuments({ comment: commentId });
            return res.status(200).json({ message: "Comment unliked successfully", likeCount });
        }

        // Create a new like
        const newLike = await Like.create({ comment: commentId, likedBy: userId });

        // Return the updated like count
        const likeCount = await Like.countDocuments({ comment: commentId });

        return res.status(200).json(
            new ApiResponse(200, { likeCount }, "Comment liked successfully")
        )
        // return res.status(200).json({ message: "Video liked successfully", likeCount });
    } catch (error) {
        throw new ApiError(500, "Failed to update the comment likes.")
    }
});

const getCommentLikeStatus = asyncHandler(async (req, res) => {
    const { commentId } = req.params;  // Extract commentId from params
    const userId = req.user.id;  // Get user ID from JWT token (assuming `req.user` is populated by your JWT middleware)

    try {
        // Find the comment by its ID
        const comment = await Comment.findById(commentId);

        if (!comment) {
            throw new ApiError(404, "Comment not found.")
        }

        // Check if the user has liked the comment
        const hasLiked = comment.likes.includes(userId);  // Assuming `likes` is an array of user IDs who liked the comment

        // Respond with the like status
        return res.status(200).json({ hasLiked });

    } catch (error) {
        throw new ApiError(500, "Failed to update the comment like status.")
    }
});

const toggleTweetLike = async (req, res) => {
    try {
        const { id } = req.params; // Tweet ID
        const userId = req.user._id; // Logged-in user's ID

        const tweet = await Tweet.findById(id);
        if (!tweet) {
            return res.status(404).json({ message: "Tweet not found" });
        }

        // Check if the user already liked the tweet
        const isLiked = tweet.likes.includes(userId);

        if (isLiked) {
            // Unlike the tweet
            tweet.likes = tweet.likes.filter((like) => like.toString() !== userId.toString());
        } else {
            // Like the tweet
            tweet.likes.push(userId);
        }

        await tweet.save();

        res.status(200).json({ likeCount: tweet.likes.length });
    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ message: "Failed to toggle like" });
    }
};

const getTweetLikeStatus = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user._id;

    try {
        const tweet = await Tweet.findById(tweetId);
        if (!tweet) {
            return res.status(404).json({ message: "Tweet not found" });
        }

        const hasLiked = tweet.likes.includes(userId);

        res.status(200).json({ hasLiked });
    } catch (error) {
        console.error("Error fetching like status:", error);
        res.status(500).json({ message: "Failed to fetch tweet like status" });
    }
});

// const getTweetLikeStatus = asyncHandler(async (req, res) => {
//     const { tweetId } = req.params;
//     const userId = req.user.id;

//     try {
//         const existingLike = await Like.findOne({ tweet: tweetId, likedBy: userId });
//         const hasLiked = !!existingLike;

//         return res.status(200).json({ hasLiked });
//     } catch (error) {
//         throw new ApiError(500, "Failed to fetch tweet like status.");
//     }
// });

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getVideoLikeStatus,
    getCommentLikeStatus,
    getTweetLikeStatus
}