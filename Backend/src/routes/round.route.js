import express from "express";

import {
   createRound,
   getTournamentRounds,
   qualifyTeams,
   getRoundById,
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

router.get(
   "/:id",
   verifyJWT,
   verifyAdmin,
   getRoundById
);

router.post(
   "/:id/qualify",
   verifyJWT,
   verifyAdmin,
   qualifyTeams
);

export default router;