import express from "express";

import {
    createTournament,
    getAllTournaments,
    getTournamentById,
    deleteTournament,
    updateTournament,
    getTournamentTeamsData,
} from "../controllers/tournament.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import { verifyAdmin } from "../middlewares/admin.middleware.js";

import { upload } from "../middlewares/multer.middleware.js";



const router = express.Router();

router.route("/")
    .get(getAllTournaments)
    .post(
        verifyJWT,
        verifyAdmin,
        upload.single("banner"),
        createTournament
    );

router.get(
    "/:id/teams-data",
    verifyJWT,
    verifyAdmin,
    getTournamentTeamsData
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