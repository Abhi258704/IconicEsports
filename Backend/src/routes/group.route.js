import express from "express";

import {
   generateGroups,
   getRoundGroups,
   getGroupLeaderboard,
   getGroupById,
   moveTeamsToGroup,
   moveTeamsToNextRound,
   rollbackQualification
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
   verifyJWT,
   verifyAdmin,
   moveTeamsToGroup
);

router.post(
   "/:id/move-to-next-round",
   verifyJWT,
   verifyAdmin,
   moveTeamsToNextRound
);

router.post(
   "/:id/rollback-qualification",
   verifyJWT,
   verifyAdmin,
   rollbackQualification
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
   verifyJWT,
   verifyAdmin,
   getGroupById
);

export default router;