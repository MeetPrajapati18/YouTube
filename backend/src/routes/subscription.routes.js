import { Router } from 'express';
import {
    getChannelDetails,
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
    checkSubscriptionStatus
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/c/:channelId") // Change parameter name
    .get(getSubscribedChannels)
    .post(toggleSubscription);

router.get("/:id", getChannelDetails);
router.get("/:channelId/subscribed", checkSubscriptionStatus)

router.route("/u/:channelId").get(getUserChannelSubscribers);

export default router