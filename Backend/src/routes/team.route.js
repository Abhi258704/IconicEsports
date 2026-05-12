import express from "express";

import {
   registerTeam,
   getTournamentTeams,
   verifyTeam,
   rejectTeam,
   getTeamById,
} from "../controllers/team.controller.js";

import { verifyJWT }
from "../middlewares/auth.middleware.js";

import { verifyAdmin }
from "../middlewares/admin.middleware.js";



const router = express.Router();

router.post(
   "/register",
   verifyJWT,
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
   verifyAdmin,
   getTeamById
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