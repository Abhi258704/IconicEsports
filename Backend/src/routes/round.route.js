import express from "express";

import {
   createRound,
   getTournamentRounds,
   qualifyTeams,
} from "../controllers/round.controller.js";

import { verifyJWT }
from "../middlewares/auth.middleware.js";

import { verifyAdmin }
from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post(
   "/",
   verifyJWT,
   verifyAdmin,
   createRound
);

router.get(
   "/tournament/:id",
   verifyJWT,
   verifyAdmin,
   getTournamentRounds
);

router.post(
   "/:id/qualify",
   verifyJWT,
   verifyAdmin,
   qualifyTeams
);

export default router;