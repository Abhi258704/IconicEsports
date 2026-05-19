import express from "express";

import {
   registerTeam,
   getTournamentTeams,
   verifyTeam,
   rejectTeam,
   getTeamById,
   getRoundGroups,
   manualAssignTeam,
} from "../controllers/team.controller.js";

import { verifyJWT }
   from "../middlewares/auth.middleware.js";

import { verifyAdmin }
   from "../middlewares/admin.middleware.js";

import { validate }
   from "../middlewares/validate.middleware.js";

import {
   registerTeamSchema,
}
   from "../validators/team.validator.js";

import {
   verifyModerator,
}
   from "../middlewares/moderator.middleware.js";



const router = express.Router();

router.post(
   "/register",
   verifyJWT,
   validate(registerTeamSchema),
   registerTeam
);

router.get(
   "/tournament/:id",
   verifyJWT,
   verifyAdmin,
   getTournamentTeams
);

router.get(
   "/:teamId",
   verifyJWT,
   getTeamById
);

router.get(
   "/round/:roundId/groups",
   verifyJWT,
   verifyAdmin,
   getRoundGroups
);

router.post(
   "/:teamId/manual-assign",
   verifyJWT,
   verifyAdmin,
   manualAssignTeam
);

router.patch(
   "/:id/verify",
   verifyJWT,
   verifyAdmin,
   verifyTeam
);

router.patch(
   "/:id/reject",
   verifyJWT,
   verifyAdmin,
   rejectTeam
);

export default router;