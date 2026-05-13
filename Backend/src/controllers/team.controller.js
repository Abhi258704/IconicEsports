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

      try {

         const { id } =
            req.params;

         const team =
            await Team.findById(id);

         if (!team) {

            throw new ApiError(
               404,
               "Team not found"
            );

         }

         /* ALLOWED TRANSITIONS */

         const allowedStatuses =
            [
               "pending",
               "rejected",
            ];

         if (
            !allowedStatuses.includes(
               team.status
            )
         ) {

            throw new ApiError(
               400,
               `Cannot verify team from ${team.status} status`
            );

         }

         /* VERIFY TEAM */

         team.status =
            "verified";

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

         /* TOURNAMENT SETTINGS */

         const tournament =
            await Tournament.findById(
               team.tournament
            );

         const TEAMS_PER_GROUP =
            tournament
               .teamsPerGroup || 16;

         /* GET GROUPS */

         const groups =
            await Group.find({

               round:
                  activeRound._id,

            }).sort({
               createdAt: 1,
            });

         /* FIND AVAILABLE GROUP */

         let group =
            groups.find(

               (g) =>

                  (
                     g.teams?.length || 0
                  ) <

                  TEAMS_PER_GROUP

            );

         /* CREATE GROUP */

         if (!group) {

            const groupCount =
               await Group.countDocuments({

                  round:
                     activeRound._id,

               });

            const groupName =
               `Group ${String.fromCharCode(
                  65 + groupCount
               )}`;

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

            activeRound.groups =
               activeRound.groups || [];

            activeRound.groups.push(
               group._id
            );

            await activeRound.save();

         }

         group.teams =
            group.teams || [];

         /* PREVENT DUPLICATES */

         const alreadyExists =
            (
               group.teams || []
            ).some(

               (memberId) =>

                  memberId.toString() ===
                  team._id.toString()

            );

         /* ASSIGN TEAM */

         if (!alreadyExists) {

            group.teams.push(
               team._id
            );

         }

         await group.save();

         /* UPDATE TEAM */

         team.group =
            group._id;

         team.currentRound =
            activeRound._id;

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

      } catch (error) {

         console.log(
            "VERIFY ERROR:",
            error
         );

         throw error;

      }

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

      if (
         team.status !==
         "verified"
      ) {

         throw new ApiError(
            400,
            "Only verified teams can be rejected"
         );

      }

      if (team.group) {

         await Group.findByIdAndUpdate(

            team.group,

            {

               $pull: {
                  teams: team._id,
               },

            }

         );

         team.group = null;

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

const getTeamById = asyncHandler(
   async (req, res) => {

      const { teamId } =
         req.params;

      const team =
         await Team.findById(
            teamId
         )

            .populate({
               path: "group",
               populate: {
                  path: "round",
               },
            })

            .populate("tournament")

            .populate("currentRound")

            .populate("eliminatedInRound")

            .populate(
               "registeredBy",
               "email username"
            );

      if (!team) {

         throw new ApiError(
            404,
            "Team not found"
         );

      }

      return res.status(200).json(

         new ApiResponse(
            200,
            team,
            "Team fetched successfully"
         )

      );

   }
);






export {
   registerTeam,
   getTournamentTeams,
   verifyTeam,
   rejectTeam,
   getTeamById,
};