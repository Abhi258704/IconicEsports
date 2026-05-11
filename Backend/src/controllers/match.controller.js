import Match from "../models/match.model.js";

import Group from "../models/group.model.js";

import { asyncHandler }
   from "../utils/asyncHandler.js";

import { ApiResponse }
   from "../utils/ApiResponse.js";

import { ApiError }
   from "../utils/ApiError.js";




const createMatch = asyncHandler(
   async (req, res) => {

      const {
         tournamentId,
         roundId,
         groupId,
         name,
         matchNumber,
         map,
         scheduledAt,
         roomId,
         roomPassword,
      } = req.body;

      if (
         !tournamentId ||
         !roundId ||
         !groupId ||
         !name ||
         !matchNumber ||
         !map ||
         !scheduledAt
      ) {

         throw new ApiError(
            400,
            "All required fields must be provided"
         );

      }

      const group =
         await Group.findById(groupId)
            .populate("teams");

      if (!group) {

         throw new ApiError(
            404,
            "Group not found"
         );

      }

      const existingMatch =
         await Match.findOne({
            group: groupId,
            matchNumber,
         });

      if (existingMatch) {

         throw new ApiError(
            400,
            "Match already exists"
         );

      }

      const match =
         await Match.create({
            tournament: tournamentId,
            round: roundId,
            group: groupId,
            name,
            matchNumber,
            map,
            scheduledAt,
            roomId,
            roomPassword,
            teams: group.teams.map(
               (team) => team._id
            ),
         });

      return res.status(201).json(
         new ApiResponse(
            201,
            match,
            "Match created successfully"
         )
      );

   }
);

const getGroupMatches = asyncHandler(
   async (req, res) => {

      const { id } = req.params;

      const matches =
         await Match.find({
            group: id,
         })
            .populate("teams")
            .sort({
               matchNumber: 1,
            });

      return res.status(200).json(
         new ApiResponse(
            200,
            matches,
            "Matches fetched successfully"
         )
      );

   }
);

const updateMatchResults = asyncHandler(
   async (req, res) => {

      const { id } = req.params;

      const { results } = req.body;

      const match =
         await Match.findById(id);

      if (!match) {

         throw new ApiError(
            404,
            "Match not found"
         );

      }

      results.forEach((result) => {

         result.totalPoints =
            result.placementPoints +
            result.kills;

      });

      match.results = results;

      match.status = "completed";

      await match.save();

      return res.status(200).json(
         new ApiResponse(
            200,
            match,
            "Results updated successfully"
         )
      );

   }
);

const getSingleMatch = asyncHandler(
   async (req, res) => {

      const { id } = req.params;

      const match =
         await Match.findById(id)
            .populate("teams")
            .populate("results.team");

      if (!match) {

         throw new ApiError(
            404,
            "Match not found"
         );

      }

      return res.status(200).json(
         new ApiResponse(
            200,
            match,
            "Match fetched successfully"
         )
      );

   }
);








export {
   createMatch,
   getGroupMatches,
   updateMatchResults,
   getSingleMatch,
};