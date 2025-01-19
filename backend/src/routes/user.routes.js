import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    changeCurrentPassword, 
    getCurentUser, 
    updateAccountDetails, 
    updateUserAvatar, 
    updateUserCoverImage ,
    getUserChannelProfile,
    getWatchHistory
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { refereshAccessToken } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        },
    ]),
    registerUser
)

router.route("/login").post(loginUser)

//secure routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(verifyJWT, refereshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)

// Get the current user's details (for edit profile)
router.route("/profile").get(verifyJWT, getCurentUser);
router.route("/update-profile").put(verifyJWT, updateAccountDetails);

// Update avatar image
// router.route("avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/update-avatar").put(verifyJWT, upload.single("avatar"), updateUserAvatar);

// Update cover image
router.route("/update-cover-image").put(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/channel-profile/:username").get(verifyJWT, getUserChannelProfile);
router.route("/watch-history").get(verifyJWT, getWatchHistory);

export default router