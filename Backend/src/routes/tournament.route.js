import express from "express";

import {
    createTournament,
    getAllTournaments,
    getTournamentById,
    deleteTournament,
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

router.route("/:id")
    .get(getTournamentById)
    .delete(
        verifyJWT,
        verifyAdmin,
        deleteTournament
    );

export default router;