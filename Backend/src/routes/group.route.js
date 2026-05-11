import express from "express";

import {
   generateGroups,
   getRoundGroups,
   getGroupLeaderboard,
} from "../controllers/group.controller.js";

import { verifyJWT }
from "../middlewares/auth.middleware.js";

import { verifyAdmin }
from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post(
   "/generate",
   verifyJWT,
   verifyAdmin,
   generateGroups
);

router.get(
   "/round/:id",
   verifyJWT,
   verifyAdmin,
   getRoundGroups
);

router.get(
   "/:id/leaderboard",
   verifyJWT,
   getGroupLeaderboard
);


export default router;