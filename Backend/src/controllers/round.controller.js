import Round from "../models/round.model.js";

import Tournament
from "../models/tournament.model.js";

import { asyncHandler }
from "../utils/asyncHandler.js";

import { ApiResponse }
from "../utils/ApiResponse.js";

import { ApiError }
from "../utils/ApiError.js";





const createRound = asyncHandler(
   async (req, res) => {

      const {
         tournamentId,
         name,
         roundNumber,
         qualificationCount,
      } = req.body;

      if (
         !tournamentId ||
         !name ||
         !roundNumber
      ) {

         throw new ApiError(
            400,
            "All fields are required"
         );

      }

      const tournament =
         await Tournament.findById(
            tournamentId
         );

      if (
         !tournament ||
         tournament.isDeleted
      ) {

         throw new ApiError(
            404,
            "Tournament not found"
         );

      }

      const existingRound =
         await Round.findOne({
            tournament: tournamentId,
            roundNumber,
         });

      if (existingRound) {

         throw new ApiError(
            400,
            "Round already exists"
         );

      }

      const round =
         await Round.create({
            tournament: tournamentId,
            name,
            roundNumber,
            qualificationCount,
         });

      tournament.rounds.push(
         round._id
      );

      await tournament.save();

      return res.status(201).json(
         new ApiResponse(
            201,
            round,
            "Round created successfully"
         )
      );

   }
);

const getTournamentRounds = asyncHandler(
   async (req, res) => {

      const { id } = req.params;

      const rounds =
         await Round.find({
            tournament: id,
         })
         .populate("groups")
         .sort({
            roundNumber: 1,
         });

      return res.status(200).json(
         new ApiResponse(
            200,
            rounds,
            "Rounds fetched successfully"
         )
      );

   }
);





export {
   createRound,
   getTournamentRounds,
};