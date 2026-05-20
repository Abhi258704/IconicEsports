import express from "express";

import {
    createTournament,
    getAllTournaments,
    getTournamentById,
    deleteTournament,
    updateTournament,
    getTournamentTeamsData,
    exportTournamentTeams,
    exportTournamentGroups,
    exportTournamentMatches,
} from "../controllers/tournament.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import { verifyAdmin } from "../middlewares/admin.middleware.js";

import { upload } from "../middlewares/multer.middleware.js";

import { validate }
    from "../middlewares/validate.middleware.js";

import {
    tournamentSchema,
}
    from "../validators/tournament.validator.js";



const router = express.Router();

router.route("/")
    .get(getAllTournaments)
    .post(
        verifyJWT,
        verifyAdmin,
        upload.single("banner"),
        validate(tournamentSchema),
        createTournament
    );

router.get(
    "/:id/teams-data",
    verifyJWT,
    verifyAdmin,
    getTournamentTeamsData
);

router.get(
    "/:id/export-teams",
    verifyJWT,
    verifyAdmin,
    exportTournamentTeams
);

router.get(
    "/:id/export-groups",
    verifyJWT,
    verifyAdmin,
    exportTournamentGroups
);

router.get(
    "/:id/export-matches",
    verifyJWT,
    verifyAdmin,
    exportTournamentMatches
);

router.route("/:id")
    .get(getTournamentById)
    .patch(
        verifyJWT,
        verifyAdmin,
        upload.single("banner"),
        updateTournament
    )
    .delete(
        verifyJWT,
        verifyAdmin,
        deleteTournament
    );

export default router;