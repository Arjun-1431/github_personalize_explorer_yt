import express from "express";
import { explorePopularRepos } from "../controllers/explore.controller.js";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.js";
import {recommended } from "../controllers/explore.controller.js";

const router = express.Router();

router.get("/repos/:language", ensureAuthenticated, explorePopularRepos);
router.get("/api/recommended-repos", recommended);

export default router;
