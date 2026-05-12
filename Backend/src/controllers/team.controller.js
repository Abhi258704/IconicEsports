import Team from "../models/team.model.js";

import Tournament from "../models/tournament.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import { ApiError } from "../utils/ApiError.js";

import Round from "../models/round.model.js";

import Group from "../models/group.model.js";






const registerTeam = asyncHandler(
   async (req, res) => {

      const {
         teamName,
         leaderName,
         leaderPhone,
         players,
         tournamentId,
      } = req.body;

      if (
         !teamName ||
         !leaderName ||
         !leaderPhone ||
         !players ||
         !tournamentId
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

      if (!tournament.registrationOpen) {

         throw new ApiError(
            400,
            "Tournament registrations are closed"
         );

      }

      const existingTeam =
         await Team.findOne({
            tournament: tournamentId,
            registeredBy: req.user._id,
            isDeleted: false,
         });

      if (existingTeam) {

         throw new ApiError(
            400,
            "You already registered a team in this tournament"
         );

      }

      const team =
         await Team.create({
            teamName,
            leaderName,
            leaderPhone,
            players,
            tournament: tournamentId,
            registeredBy: req.user._id,
         });

      return res.status(201).json(
         new ApiResponse(
            201,
            team,
            "Team registered successfully"
         )
      );

   }
);

const getTournamentTeams = asyncHandler(
   async (req, res) => {

      const { id } = req.params;

      const teams = await Team.find({
         tournament: id,
         isDeleted: false,
      }).sort({ createdAt: -1 });

      return res.status(200).json(
         new ApiResponse(
            200,
            teams,
            "Teams fetched successfully"
         )
      );

   }
);

const verifyTeam = asyncHandler(
   async (req, res) => {

      const { id } = req.params;

      const team =
         await Team.findById(id);

      if (!team) {

         throw new ApiError(
            404,
            "Team not found"
         );

      }

      /* VERIFY TEAM */

      team.status = "verified";

      /* FIND ACTIVE ROUND */

      const activeRound =
         await Round.findOne({
            tournament:
               team.tournament,

            status: {
               $in: [
                  "ongoing",
                  "upcoming",
               ],
            },
         }).sort({
            roundNumber: 1,
         });

      if (!activeRound) {

         throw new ApiError(
            404,
            "No active round found"
         );

      }

      /* FIND AVAILABLE GROUP */

      let group =
         await Group.findOne({
            round:
               activeRound._id,
         })

         .populate("teams")

         .sort({
            createdAt: 1,
         });

      const TEAMS_PER_GROUP = 8;

      if (
         !group ||

         group.teams.length >=
         TEAMS_PER_GROUP
      ) {

         /* CREATE NEW GROUP */

         const groupCount =
            await Group.countDocuments({
               round:
                  activeRound._id,
            });

         const groupName =
            `Group ${
               String.fromCharCode(
                  65 + groupCount
               )
            }`;

         group =
            await Group.create({

               name:
                  groupName,

               tournament:
                  team.tournament,

               round:
                  activeRound._id,

               teams: [],
            });

         activeRound.groups.push(
            group._id
         );

         await activeRound.save();

      }

      /* ASSIGN TEAM */

      group.teams.push(
         team._id
      );

      await group.save();

      team.group =
         group._id;

      await team.save();

      return res.status(200).json(

         new ApiResponse(
            200,
            {
               team,
               group,
            },
            "Team verified and assigned successfully"
         )

      );

   }
);

const rejectTeam = asyncHandler(
   async (req, res) => {

      const { id } = req.params;

      const team =
         await Team.findById(id);

      if (!team) {

         throw new ApiError(
            404,
            "Team not found"
         );

      }

      team.status = "rejected";

      await team.save();

      return res.status(200).json(
         new ApiResponse(
            200,
            team,
            "Team rejected successfully"
         )
      );

   }
);







export {
   registerTeam,
   getTournamentTeams,
   verifyTeam,
   rejectTeam,
};