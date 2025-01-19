import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelDetails = async (req, res) => {
    try {
        const { id } = req.params; // Channel ID from route
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "Channel not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Error fetching channel details:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params; // Extract channelId from params
    const userId = req.user.id; // Extract userId from verified JWT (auth middleware)

    try {
        // Check if a subscription already exists
        const existingSubscription = await Subscription.findOne({
            subscriber: userId,
            channel: channelId,
        });

        if (existingSubscription) {
            // If subscription exists, remove it (unsubscribe)
            await Subscription.findByIdAndDelete(existingSubscription._id);
            return res.status(200).json({
                success: true,
                message: "Unsubscribed successfully",
            });
        } else {
            // If no subscription exists, create one (subscribe)
            const newSubscription = new Subscription({
                subscriber: userId,
                channel: channelId,
            });
            await newSubscription.save();

            return res.status(200).json(
                new ApiResponse(200, {}, "Subscription status updated succesfully")
            );
        }
    } catch (error) {
        console.error("Error toggling subscription:", error);
        res.status(500);
        throw new ApiError(500, "Failed to toggle subscription. Please try again.");
    }
});

// Controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params; // Get channelId from the route

    try {
        // Validate channelId format
        if (!mongoose.isValidObjectId(channelId)) {
            return res.status(400).json({ message: "Invalid channel ID" });
        }

        // Find all subscriptions where the channel matches the provided channelId
        const subscribers = await Subscription.find({ channel: channelId }).populate('subscriber', 'fullName username avatar');

        // If no subscribers are found
        if (subscribers.length === 0) {
            return res.status(404).json({ message: "No subscribers found for this channel" });
        }

        // Extract subscriber details
        const subscriberList = subscribers.map(sub => sub.subscriber);

        res.status(200).json({
            success: true,
            data: subscriberList,
        });
    } catch (error) {
        console.error("Error fetching subscribers:", error);
        res.status(500).json({ message: "Server error" });
    }
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { channelId } = req.params; // Get subscriberId from the route

    try {
        // Validate subscriberId format
        if (!mongoose.isValidObjectId(channelId)) {
            return res.status(400).json({ message: "Invalid subscriber ID" });
        }

        // Find all subscriptions where the subscriber matches the provided subscriberId
        const subscriptions = await Subscription.find({ subscriber: channelId }).populate('channel', 'fullName username avatar');

        // If no subscriptions are found
        if (!subscriptions || subscriptions.length === 0) {
            return res.status(404).json({ message: "No subscriptions found for this user" });
        }

        // Extract channel details
        const channelList = subscriptions.map(sub => sub.channel);

        res.status(200).json({
            success: true,
            data: channelList,
        });
    } catch (error) {
        console.error("Error fetching subscribed channels:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Controller to check if a user is subscribed to the channel
const checkSubscriptionStatus = asyncHandler(async (req, res) => {
    const { channelId } = req.params; // Channel ID from route
    const userId = req.user.id; // Extract userId from verified JWT (auth middleware)

    try {
        // Check if the user is subscribed to the channel
        const subscription = await Subscription.findOne({
            subscriber: userId,
            channel: channelId,
        });

        if (subscription) {
            return res.status(200).json({
                success: true,
                isSubscribed: true, // The user is subscribed
            });
        } else {
            return res.status(200).json({
                success: true,
                isSubscribed: false, // The user is not subscribed
            });
        }
    } catch (error) {
        console.error("Error checking subscription status:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export {
    getChannelDetails,
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
    checkSubscriptionStatus
}