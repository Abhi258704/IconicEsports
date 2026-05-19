import express from "express";

import {
   generateGroups,
   getRoundGroups,
   getGroupLeaderboard,
   getGroupById,
   moveTeamsToGroup,
   moveTeamsToNextRound,
   rollbackQualification,
   assignModeratorToGroup,
   removeModeratorFromGroup,
} from "../controllers/group.controller.js";

import { verifyJWT }
   from "../middlewares/auth.middleware.js";

import { verifyAdmin }
   from "../middlewares/admin.middleware.js";

import {
   verifyGroupModerator,
}
   from "../middlewares/groupModerator.middleware.js";

import { validate }
   from "../middlewares/validate.middleware.js";

import {
   moveTeamsToNextRoundSchema,
   moveTeamsSchema,
}
   from "../validators/group.validator.js";

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
   validate(moveTeamsSchema),
   moveTeamsToGroup
);

router.patch(
   "/:id/assign-moderator",
   verifyJWT,
   verifyAdmin,
   assignModeratorToGroup
);

router.patch(
   "/:id/remove-moderator",
   verifyJWT,
   verifyAdmin,
   removeModeratorFromGroup
);

router.post(
   "/:id/move-to-next-round",
   verifyJWT,
   verifyGroupModerator,
   validate(moveTeamsToNextRoundSchema),
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
   verifyGroupModerator,
   getGroupById
);

export default router;