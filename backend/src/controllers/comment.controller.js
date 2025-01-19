import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
// import Video from "../models/video.model.js";
import { Video } from "../models/video.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params; // Get videoId from route params

    try {
        // Fetch all comments for the specified video
        const comments = await Comment.find({ video: videoId })
            .sort({ createdAt: -1 }); // Optionally, you can sort comments by creation date (most recent first)

        // Send the comments as response
        res.json({
            success: true,
            data: comments, // Return the comments directly
        });
    } catch (err) {
        console.error("Error fetching comments:", err);
        res.status(500).json({ message: "Error fetching comments" });
    }
});

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params; // Get video ID from the route params
    const { content } = req.body; // Get the comment content from the request body
    const userId = req.user._id; // Assume `req.user` contains the authenticated user's data

    try {
        // Validate inputs
        if (!content || content.trim() === "") {
            res.status(400);
            throw new Error("Comment content is required.");
        }

        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            res.status(400);
            throw new Error("Invalid video ID.");
        }

        // Check if the video exists
        const videoExists = await Video.findById(videoId);
        if (!videoExists) {
            res.status(404);
            throw new Error("Video not found.");
        }

        // Create a new comment
        const comment = await Comment.create({
            content,
            video: videoId,
            owner: userId,
        });

        // Populate the owner details in the response
        const populatedComment = await comment.populate("owner", "username email fullName");

        // Respond with the created comment
        return res.status(201).json(
            new ApiResponse(200, populatedComment, "User has been registered successfully.")
        );
    } catch (error) {
        throw new ApiError(400, error.message)
    }
});


const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;         // Extract commentId from request params
    const { content } = req.body;             // Extract new comment content from request body

    // 1. Find the comment by its ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
        // If the comment doesn't exist, return a 404 error
        res.status(404);
        throw new Error("Comment not found");
    }

    // 2. Check if the user is the owner of the comment
    // const userId = req.user._id;  // Assuming userId is stored in `req.user` from authentication middleware
    // if (comment.user.toString() !== userId.toString()) {
    //     // If the user is not the owner, return a 403 Forbidden error
    //     res.status(403);
    //     throw new Error("You are not authorized to update this comment");
    // }

    // 3. Update the comment content
    comment.content = content;

    // 4. Save the updated comment
    await comment.save();

    // 5. Respond with the updated comment data
    res.status(200).json({
        message: "Comment updated successfully",
        data: comment,
    });
});

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;

    try {
        const comment = await Comment.findByIdAndDelete(commentId);
    
        if (!comment) {
            throw new ApiError(404, "Comment not found");
        }
    
        return res.status(200).json(
            new ApiResponse(200, comment, "Comment has been deleted successfully.")
        );
    } catch (error) {
        throw new ApiError(500, "Failed to delete comment. Please try again later.");
    }
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}