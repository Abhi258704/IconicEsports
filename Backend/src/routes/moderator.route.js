import express from "express";

import { verifyJWT }
from "../middlewares/auth.middleware.js";

import {
   verifyModerator,
}
from "../middlewares/moderator.middleware.js";

import {
   getModeratorGroups,
   getModeratorMatches,
}
from "../controllers/moderator.controller.js";

const router = express.Router();

router.get(
   "/groups",
   verifyJWT,
   verifyModerator,
   getModeratorGroups
);

router.get(
   "/matches",
   verifyJWT,
   verifyModerator,
   getModeratorMatches
);

export default router;