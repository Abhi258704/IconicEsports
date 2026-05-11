import express from "express";

import {
   createMatch,
   getGroupMatches,
   updateMatchResults,
   getSingleMatch,
} from "../controllers/match.controller.js";

import { verifyJWT }
from "../middlewares/auth.middleware.js";

import { verifyAdmin }
from "../middlewares/admin.middleware.js";

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
   updateMatchResults
);

router.get(
   "/:id",
   verifyJWT,
   getSingleMatch
);

export default router;