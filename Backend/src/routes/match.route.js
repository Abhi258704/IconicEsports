import express from "express";

import {
   createMatch,
   getGroupMatches,
   updateMatchResults,
   getSingleMatch,
   updateMatchRoom,
   updateMatch,
} from "../controllers/match.controller.js";

import { verifyJWT }
from "../middlewares/auth.middleware.js";

import { verifyAdmin }
from "../middlewares/admin.middleware.js";

import { validate }
from "../middlewares/validate.middleware.js";

import {
   updateMatchResultsSchema,
}
from "../validators/match.validator.js";

const router = express.Router();

router.post(
   "/",
   verifyJWT,
   verifyAdmin,
   createMatch
);

router.get(
   "/group/:id",
   verifyJWT,
   verifyAdmin,
   getGroupMatches
);

router.patch(
   "/:id/result",
   verifyJWT,
   verifyAdmin,
   validate(updateMatchResultsSchema),
   updateMatchResults
);

router.get(
   "/:id",
   verifyJWT,
   verifyAdmin,
   getSingleMatch
);

router.patch(
   "/:id/room",
   verifyJWT,
   verifyAdmin,
   updateMatchRoom
);

router.patch(
   "/:id",
   verifyJWT,
   verifyAdmin,
   updateMatch
);

export default router;