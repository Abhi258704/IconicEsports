import express from "express";

import {
   createRound,
   getTournamentRounds,
   getRoundById,
   getNextRound,
   updateRound,
} from "../controllers/round.controller.js";

import { verifyJWT }
   from "../middlewares/auth.middleware.js";

import { verifyAdmin }
   from "../middlewares/admin.middleware.js";

import {
verifyModerator,
}
from "../middlewares/moderator.middleware.js";

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
   verifyModerator,
   getRoundById
);

router.patch(
   "/:id",
   verifyJWT,
   verifyAdmin,
   updateRound
);

router.get(
   "/next/:id",
   verifyJWT,
   verifyAdmin,
   getNextRound
);

// router.post(
//    "/:id/qualify",
//    verifyJWT,
//    verifyAdmin,
//    qualifyTeams
// );

export default router;