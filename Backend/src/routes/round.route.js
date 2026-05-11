import express from "express";

import {
   createRound,
   getTournamentRounds,
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

export default router;