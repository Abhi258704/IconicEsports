import Round from "../models/round.model.js";

import Tournament
   from "../models/tournament.model.js";

import { asyncHandler }
   from "../utils/asyncHandler.js";

import { ApiResponse }
   from "../utils/ApiResponse.js";

import { ApiError }
   from "../utils/ApiError.js";

import mongoose from "mongoose";

import Group from "../models/group.model.js";

import Match from "../models/match.model.js";

import Team from "../models/team.model.js";




const createRound = asyncHandler(
   async (req, res) => {

      const {
         tournamentId,
         name,
         roundNumber,
         qualificationCount,
         previousRound,
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

            previousRound,
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

const qualifyTeams = asyncHandler(
   async (req, res) => {

      const { id } = req.params;

      const round =
         await Round.findById(id);

      if (!round) {

         throw new ApiError(
            404,
            "Round not found"
         );

      }

      // PREVENT RE-QUALIFICATION
      if (round.status === "completed") {

         throw new ApiError(
            400,
            "Teams already qualified for this round"
         );

      }

      const groups =
         await Group.find({
            round: id,
         });

      const qualifiedTeams = [];

      for (const group of groups) {

         const leaderboard =
            await Match.aggregate([

               {
                  $match: {
                     group: group._id,
                     status: "completed",
                  },
               },

               {
                  $unwind: "$results",
               },

               {
                  $group: {
                     _id:
                        "$results.team",

                     totalPoints: {
                        $sum:
                           "$results.totalPoints",
                     },

                     totalPlacementPoints: {
                        $sum:
                           "$results.placementPoints",
                     },

                     totalKills: {
                        $sum:
                           "$results.kills",
                     },
                  },
               },

               {
                  $sort: {
                     totalPoints: -1,
                     totalPlacementPoints: -1,
                     totalKills: -1,
                  },
               },

               {
                  $limit:
                     round.qualificationCount,
               },
            ]);

         for (
            const teamData
            of leaderboard
         ) {

            await Team.findByIdAndUpdate(
               teamData._id,
               {
                  $addToSet: {
                     qualifiedRounds:
                        round._id,
                  },
               }
            );

            qualifiedTeams.push(
               teamData
            );

         }

      }

      // MARK ROUND COMPLETED
      round.status = "completed";

      await round.save();

      return res.status(200).json(
         new ApiResponse(
            200,
            qualifiedTeams,
            "Teams qualified successfully"
         )
      );

   }
);

const getRoundById = asyncHandler(
   async (req, res) => {

      const { id } =
         req.params;

      const round =
         await Round.findById(id)

            .populate({
               path: "groups",
               populate: {
                  path: "teams",
               },
            });

      if (!round) {

         throw new ApiError(
            404,
            "Round not found"
         );

      }

      return res.status(200).json(

         new ApiResponse(
            200,
            round,
            "Round fetched successfully"
         )

      );

   }
);



export {
   createRound,
   getTournamentRounds,
   qualifyTeams,
   getRoundById,
};