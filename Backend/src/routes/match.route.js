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

import {
   verifyGroupModerator,
}
   from "../middlewares/groupModerator.middleware.js";

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
   verifyGroupModerator,
   createMatch
);

router.get(
   "/group/:id",
   verifyJWT,
   verifyGroupModerator,
   getGroupMatches
);

router.patch(
   "/:id/result",
   verifyJWT,
   verifyGroupModerator,
   validate(updateMatchResultsSchema),
   updateMatchResults
);

router.get(
   "/:id",
   verifyJWT,
   verifyGroupModerator,
   getSingleMatch
);

router.patch(
   "/:id/room",
   verifyJWT,
   verifyGroupModerator,
   updateMatchRoom
);

router.patch(
   "/:id",
   verifyJWT,
   verifyGroupModerator,
   updateMatch
);

export default router;