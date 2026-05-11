import Tournament from "../models/tournament.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import { ApiError } from "../utils/ApiError.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";






const createTournament = asyncHandler(
    async (req, res) => {

        const {
            name,
            game,
            prizePool,
            entryFee,
            maxTeams,
            teamSize,
            maps,
            rules,
            startDate,
        } = req.body;

        const parsedMaps =
            JSON.parse(maps);

        if (!name || !prizePool) {
            throw new ApiError(
                400,
                "Name and prize pool are required"
            );
        }

        const bannerLocalPath =
            req.file?.path;

        if (!bannerLocalPath) {

            throw new ApiError(
                400,
                "Tournament banner is required"
            );

        }

        const banner =
            await uploadOnCloudinary(
                bannerLocalPath
            );

        if (!banner) {

            throw new ApiError(
                400,
                "Banner upload failed"
            );

        }


        const tournament =
            await Tournament.create({
                name,
                game,
                prizePool,
                entryFee,
                maxTeams,
                teamSize,
                maps: parsedMaps,
                banner: banner.url,
                rules,
                startDate,
                createdBy: req.user._id,
            });

        return res.status(201).json(
            new ApiResponse(
                201,
                tournament,
                "Tournament created successfully"
            )
        );

    }
);

const getAllTournaments = asyncHandler(
    async (req, res) => {

        const tournaments =
            await Tournament.find({
                isDeleted: false,
            })
                .populate(
                    "createdBy",
                    "name email avatar"
                )
                .sort({ createdAt: -1 });

        return res.status(200).json(
            new ApiResponse(
                200,
                tournaments,
                "Tournaments fetched successfully"
            )
        );

    }
);

const getTournamentById = asyncHandler(
    async (req, res) => {

        const { id } = req.params;

        const tournament =
            await Tournament.findById({
                _id: id,
                isDeleted: false,
            })
                .populate(
                    "createdBy",
                    "name email avatar"
                )
                .populate("rounds");

        if (!tournament) {
            throw new ApiError(
                404,
                "Tournament not found"
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                tournament,
                "Tournament fetched successfully"
            )
        );

    }
);

const deleteTournament = asyncHandler(
    async (req, res) => {

        const { id } = req.params;

        const tournament =
            await Tournament.findById(id);

        if (!tournament) {
            throw new ApiError(
                404,
                "Tournament not found"
            );
        }

        tournament.isDeleted = true;

        await tournament.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Tournament deleted successfully"
            )
        );

    }
);







export {
    createTournament,
    getAllTournaments,
    getTournamentById,
    deleteTournament,
};