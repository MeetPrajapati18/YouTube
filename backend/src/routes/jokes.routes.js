import { Router } from "express";
import { jokesList } from "../controllers/jokes.controller.js";

const router = Router();

// Use a more intuitive endpoint
router.route("/").get(jokesList);

export default router;