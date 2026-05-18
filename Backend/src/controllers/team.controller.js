import Team from "../models/team.model.js";

import Match from "../models/match.model.js";

import Tournament from "../models/tournament.model.js";

import Group from "../models/group.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import { ApiError } from "../utils/ApiError.js";

import Round from "../models/round.model.js";


import {
   verifyTeamService,
   manualAssignTeamService,
   rejectTeamService,
}
from "../services/team.service.js";





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
      })
         .sort({ createdAt: -1 })
         .lean();

      return res.status(200).json(
         new ApiResponse(
            200,
            teams,
            "Teams fetched successfully"
         )
      );

   }
);

const getRoundGroups = asyncHandler(
   async (req, res) => {

      try {

         // console.log("PARAMS:", req.params);

         const { roundId } = req.params;

         // console.log("ROUND ID:", roundId);

         // console.log("Group model:", Group);

         const groups =
            await Group.find({
               round: roundId,
            })
               .populate("teams")
               .sort({ name: 1 })
               .lean();

         // console.log("GROUPS:", groups);

         return res.status(200).json(

            new ApiResponse(
               200,
               groups,
               "Groups fetched successfully"
            )

         );

      } catch (error) {

         console.log("GET ROUND GROUPS ERROR:");
         console.log(error);

         throw error;

      }

   }
);

const verifyTeam = asyncHandler(
   async (req, res) => {

      const { id } =
         req.params;

      const result =
         await verifyTeamService({
            teamId: id,
         });

      if (
         result.requiresManualPlacement
      ) {

         return res.status(200).json(

            new ApiResponse(
               200,
               result,
               "Tournament already started"
            )

         );

      }

      return res.status(200).json(

         new ApiResponse(
            200,
            result,
            "Team verified and assigned successfully"
         )

      );

   }
);

const rejectTeam = asyncHandler(
   async (req, res) => {

      const { id } =
         req.params;

      const team =
         await rejectTeamService({
            teamId: id,
         });

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

const manualAssignTeam = asyncHandler(
   async (req, res) => {

      const { teamId } =
         req.params;

      const {
         roundId,
         groupId,
      } = req.body;

      const result =
         await manualAssignTeamService({

            teamId,

            roundId,

            groupId,

         });

      return res.status(200).json(

         new ApiResponse(
            200,
            result,
            "Team assigned successfully"
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
   getRoundGroups,
   manualAssignTeam,
};