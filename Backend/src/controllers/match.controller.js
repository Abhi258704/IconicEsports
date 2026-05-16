import Match from "../models/match.model.js";

import Group from "../models/group.model.js";

import { asyncHandler }
   from "../utils/asyncHandler.js";

import { ApiResponse }
   from "../utils/ApiResponse.js";

import { ApiError }
   from "../utils/ApiError.js";

import {
   createMatchService,
   updateMatchResultsService,
}
   from "../services/match.service.js";




const createMatch = asyncHandler(
   async (req, res) => {

      const {
         tournamentId,
         roundId,
         groupId,
         matchNumber,
         map,
         scheduledAt,
      } = req.body;

      const match =
         await createMatchService({

            tournamentId,

            roundId,

            groupId,

            matchNumber,

            map,

            scheduledAt,

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
            })
            .lean();

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

      const { id } =
         req.params;

      const { results } =
         req.body;

      const match =
         await updateMatchResultsService({

            matchId: id,

            results,

         });

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
            .populate("results.team")
            .lean();

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

const updateMatchRoom = asyncHandler(
   async (req, res) => {

      const { id } =
         req.params;

      const {
         roomId,
         roomPassword,
         startTime,
      } = req.body;

      if (
         !roomId ||
         !roomPassword ||
         !startTime
      ) {

         throw new ApiError(
            400,
            "Room details are required"
         );

      }

      const match =
         await Match.findById(id);

      if (!match) {

         throw new ApiError(
            404,
            "Match not found"
         );

      }

      match.roomId =
         roomId;

      match.roomPassword =
         roomPassword;

      match.startTime =
         startTime;

      await match.save();

      return res.status(200).json(
         new ApiResponse(
            200,
            match,
            "Room details updated"
         )
      );

   }
);

const updateMatch = asyncHandler(
   async (req, res) => {

      const { id } =
         req.params;

      const {
         matchNumber,
         map,
         scheduledAt,
      } = req.body;

      const match =
         await Match.findById(id);

      if (!match) {

         throw new ApiError(
            404,
            "Match not found"
         );

      }

      match.matchNumber =
         matchNumber ||
         match.matchNumber;

      match.map =
         map || match.map;

      match.scheduledAt =
         scheduledAt ||
         match.scheduledAt;

      match.name =
         `Match ${match.matchNumber}`;

      await match.save();

      return res.status(200).json(

         new ApiResponse(
            200,
            match,
            "Match updated successfully"
         )

      );

   }
);







export {
   createMatch,
   getGroupMatches,
   updateMatchResults,
   getSingleMatch,
   updateMatchRoom,
   updateMatch,
};