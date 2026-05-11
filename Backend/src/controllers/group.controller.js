import Group from "../models/group.model.js";

import Round from "../models/round.model.js";

import Team from "../models/team.model.js";

import { asyncHandler }
   from "../utils/asyncHandler.js";

import { ApiResponse }
   from "../utils/ApiResponse.js";

import { ApiError }
   from "../utils/ApiError.js";

import mongoose from "mongoose";

import Match from "../models/match.model.js";




const generateGroups = asyncHandler(
   async (req, res) => {

      const {
         tournamentId,
         roundId,
      } = req.body;

      const round =
         await Round.findById(roundId);

      if (!round) {

         throw new ApiError(
            404,
            "Round not found"
         );

      }

      const existingGroups =
         await Group.find({
            round: roundId,
         });

      if (existingGroups.length > 0) {

         throw new ApiError(
            400,
            "Groups already generated"
         );

      }

      let teams = [];

      // ROUND 1
      if (!round.previousRound) {

         teams = await Team.find({
            tournament: tournamentId,
            status: "verified",
            isDeleted: false,
         });

      }

      // NEXT ROUNDS
      else {

         teams = await Team.find({
            tournament: tournamentId,

            qualifiedRounds:
               round.previousRound,

            isDeleted: false,
         });

      }

      if (teams.length === 0) {

         throw new ApiError(
            400,
            "No eligible teams found"
         );

      }

      // OPTIONAL RANDOM SHUFFLE
      teams.sort(() => Math.random() - 0.5);

      const TEAMS_PER_GROUP = 16;

      const requiredGroups =
         Math.ceil(
            teams.length /
            TEAMS_PER_GROUP
         );

      const createdGroups = [];

      for (
         let i = 0;
         i < requiredGroups;
         i++
      ) {

         const groupName =
            `Group ${String.fromCharCode(
               65 + i
            )}`;

         const groupTeams =
            teams.slice(
               i * TEAMS_PER_GROUP,
               (i + 1) * TEAMS_PER_GROUP
            );

         const group =
            await Group.create({
               name: groupName,

               tournament: tournamentId,

               round: roundId,

               teams: groupTeams.map(
                  (team) => team._id
               ),
            });

         for (
            const team of groupTeams
         ) {

            team.group = group._id;

            await team.save();

         }

         round.groups.push(group._id);

         createdGroups.push(group);

      }

      await round.save();

      return res.status(201).json(
         new ApiResponse(
            201,
            createdGroups,
            "Groups generated successfully"
         )
      );

   }
);

const getRoundGroups = asyncHandler(
   async (req, res) => {

      const { id } = req.params;

      const groups =
         await Group.find({
            round: id,
         })
            .populate("teams")
            .sort({ name: 1 });

      return res.status(200).json(
         new ApiResponse(
            200,
            groups,
            "Groups fetched successfully"
         )
      );

   }
);

const getGroupLeaderboard = asyncHandler(
   async (req, res) => {

      const { id } = req.params;

      const leaderboard =
         await Match.aggregate([

            {
               $match: {
                  group:
                     new mongoose.Types.ObjectId(id),

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

                  matchesPlayed: {
                     $sum: 1,
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
               $lookup: {
                  from: "teams",

                  localField: "_id",

                  foreignField: "_id",

                  as: "team",
               },
            },

            {
               $unwind: "$team",
            },
         ]);

      return res.status(200).json(
         new ApiResponse(
            200,
            leaderboard,
            "Leaderboard fetched successfully"
         )
      );

   }
);



export {
   generateGroups,
   getRoundGroups,
   getGroupLeaderboard,
};