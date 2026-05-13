import express from "express";

import {
   generateGroups,
   getRoundGroups,
   getGroupLeaderboard,
   getGroupById,
   moveTeamsToGroup,
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

router.patch(
   "/move-teams",
   moveTeamsToGroup
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

router.get(
   "/:id",
   getGroupById
);

export default router;