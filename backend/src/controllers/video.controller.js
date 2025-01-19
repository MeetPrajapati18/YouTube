import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { query = "", sortBy = "createdAt", sortType = "desc", userId } = req.query;

    // Build the filter object
    const filter = {
        isPublished: true,
    };

    if (query) {
        filter.title = { $regex: query, $options: "i" }; // Case-insensitive search for title
    }

    if (userId) {
        filter.owner = userId; // Use 'owner' instead of 'user'
    }

    try {
        // Calculate pagination
        // const skip = (page - 1) * limit;
        const sortOptions = { [sortBy]: sortType === "desc" ? -1 : 1 };

        // Fetch videos from the database
        const videos = await Video.find(filter)
            .sort(sortOptions)
            // .skip(skip)
            // .limit(Number(limit))
            .populate("owner", "username email fullName"); // Populate owner details

        // Count total videos matching the filter
        // const totalVideos = await Video.countDocuments(filter);

        // Return paginated response
        res.status(200).json({
            success: true,
            data: videos,
            // pagination: {
            //     totalVideos,
            //     totalPages: Math.ceil(totalVideos / limit),
            //     currentPage: Number(page),
            //     limit: Number(limit),
            // },
        });
    } catch (error) {
        console.error("Error fetching videos:", error);
        res.status(500);
        throw new Error("Failed to fetch videos. Please try again later.");
    }
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, duration } = req.body
    // TODO: get video, upload to cloudinary, create video
    /**
     * 1. Get video file and thumbnail from req.files
     * 2. Upload video file and thumbnail to cloudinary
     * 3. Create video in database
     * 4. Return response
     */

    if (
        [title, description, duration].includes(undefined) || [title, description, duration].some((field) => !field.trim())
    ) {
        throw new ApiError(400, "All fields are required")
    }

    console.log("Request Body:", req.body);
    console.log("Uploaded Files:", req.files);

    if (!req.files?.videoFile || req.files.videoFile.length === 0 || !req.files?.thumbnail || req.files.thumbnail.length === 0) {
        throw new ApiError(400, "Video and thumbnail files are required.");
    }

    const videoPath = req.files.videoFile[0].path;
    const thumbnailPath = req.files.thumbnail[0].path;

    const video = await uploadOnCloudinary(videoPath, "video");
    const thumbnail = await uploadOnCloudinary(thumbnailPath, "image");

    const newVideo = new Video({
        title: title.trim(),
        description: description.trim(),
        duration: duration.trim(),
        videoFile: video.url,
        thumbnail: thumbnail.url,
        owner: req.user._id
    });

    const savedVideo = await newVideo.save();

    const createdVideo = await Video.findById(savedVideo._id).select("-__v").populate("owner", "name email fullName");

    if (!createdVideo) {
        throw new ApiError(500, "Video uploading failed.");
    }

    return res.status(201).json(
        new ApiResponse(200, createdVideo, "Video has been uploaded successfully")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: get video by id
    /**
     * 1. Check if videoId is valid
     * 2. Get video by id
     * 3. Return response
     */
    try {
        const video = await Video.findById(videoId).populate("owner", "username email fullName avatar");
        console.log(video);
        if (!video) {
          res.status(404);
          throw new Error("Video not found");
        }
        res.status(200).json({ success: true, data: video });
      } catch (error) {
        console.error("Error fetching video:", error);
        res.status(500);
        throw new Error("Failed to fetch video. Please try again later.");
      }
});

const getVideosByUser = asyncHandler(async (req, res) => {
    const { userId } = req.params; // Get userId from URL params
    const { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc" } = req.query;

    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required." });
    }

    const filter = { owner: userId }; // Filter by userId

    try {
        const skip = (page - 1) * limit;
        const sortOptions = { [sortBy]: sortType === "desc" ? -1 : 1 };

        const videos = await Video.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit))
            .populate("owner", "username email fullName");

        const totalVideos = await Video.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: videos,
            pagination: {
                totalVideos,
                totalPages: Math.ceil(totalVideos / limit),
                currentPage: Number(page),
                limit: Number(limit),
            },
        });
    } catch (error) {
        console.error("Error fetching videos:", error);
        res.status(500).json({ success: false, message: "Failed to fetch videos. Please try again later." });
    }
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    try {
        // Validate videoId
        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            throw new ApiError(400, "Invalid video ID.");
        }

        // Validate required fields
        const { title, description } = req.body;
        if (!title || !description) {
            throw new ApiError(400, "Title and description are required.");
        }

        // Validate and upload thumbnail
        if (!req.file) {
            throw new ApiError(400, "Thumbnail file is required.");
        }
        const thumbnailPath = req.file.path;
        const thumbnail = await uploadOnCloudinary(thumbnailPath);

        // Remove local thumbnail file after upload
        // fs.unlinkSync(thumbnailPath);

        // Update video details
        const video = await Video.findByIdAndUpdate(
            videoId,
            {
                $set: {
                    title,
                    description,
                    thumbnail: thumbnail.url,
                },
            },
            { new: true }
        ).select("-videoFile -__v");

        if (!video) {
            throw new ApiError(404, "Video not found.");
        }

        return res.status(200).json(
            new ApiResponse(200, video, "Video details have been updated successfully.")
        );
    } catch (error) {
        throw new ApiError(500, "Failed to update video details. Please try again later.");
    }
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    try {
        // Validate videoId
        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            throw new ApiError(400, "Invalid video ID.");
        }

        const video = await Video.findByIdAndDelete(videoId);

        if (!video) {
            throw new ApiError(404, "Video not found.");
        }

        return res.status(200).json(
            new ApiResponse(200, video, "Video has been deleted successfully.")
        );
    } catch (error) {
        throw new ApiError(500, "Failed to delete video. Please try again later.");
    }
});

const togglePublishStatus = asyncHandler(async (req, res, next) => {
    const { videoId } = req.params;

    try {
        // Validate videoId
        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            return next(new ApiError(400, "Invalid video ID."));
        }

        // Find the video by ID
        const video = await Video.findById(videoId);

        if (!video) {
            return next(new ApiError(404, "Video not found."));
        }

        // Toggle the publish status
        video.isPublished = !video.isPublished;

        // Save the updated video
        await video.save();

        // Respond with success
        return res.status(200).json(
            new ApiResponse(200, video, `Video is now ${video.isPublished ? "published" : "unpublished"}.`)
        );
    } catch (error) {
        console.error("Error toggling publish status:", error);
        return next(new ApiError(500, "Failed to toggle publish status. Please try again later."));
    }
});

const incrementVideoViews = async (req, res) => {
    const { videoId } = req.params;

    try {
        // Validate video ID
        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            return res.status(400).json({ message: "Invalid video ID." });
        }

        // Increment views count
        const video = await Video.findByIdAndUpdate(
            videoId,
            { $inc: { views: 1 } },
            { new: true } // Return the updated document
        );

        if (!video) {
            return res.status(404).json({ message: "Video not found." });
        }

        res.status(200).json({ success: true, data: video });
    } catch (error) {
        console.error("Error incrementing video views:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getVideosByUser,
    incrementVideoViews,
}
