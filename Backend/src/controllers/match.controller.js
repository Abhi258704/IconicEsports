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
      } = req.body;

      if (
         !tournamentId ||
         !roundId ||
         !groupId ||
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
            name: `Match ${matchNumber}`,
            matchNumber,
            map,
            scheduledAt,

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
         await Match.findById(id)
            .populate("teams");

      if (!match) {

         throw new ApiError(
            404,
            "Match not found"
         );

      }

      if (
         !results ||
         !Array.isArray(results) ||
         results.length === 0
      ) {

         throw new ApiError(
            400,
            "Results are required"
         );

      }

      const submittedTeams =
         new Set();

      results.forEach((result) => {

         // TEAM REQUIRED
         if (!result.team) {

            throw new ApiError(
               400,
               "Team is required"
            );

         }

         // DUPLICATE TEAM CHECK
         if (
            submittedTeams.has(
               result.team.toString()
            )
         ) {

            throw new ApiError(
               400,
               "Duplicate teams found in results"
            );

         }

         submittedTeams.add(
            result.team.toString()
         );

         // TEAM MUST BELONG TO MATCH
         const teamExists =
            match.teams.some(
               (team) =>
                  team._id.toString() ===
                  result.team.toString()
            );

         if (!teamExists) {

            throw new ApiError(
               400,
               "Invalid team in results"
            );

         }

         // NEGATIVE KILLS CHECK
         if (result.kills < 0) {

            throw new ApiError(
               400,
               "Kills cannot be negative"
            );

         }

         // NEGATIVE PLACEMENT POINTS CHECK
         if (
            result.placementPoints < 0
         ) {

            throw new ApiError(
               400,
               "Placement points cannot be negative"
            );

         }

         // INVALID PLACEMENT CHECK
         // if (
         //    result.placement < 1 ||
         //    result.placement >
         //    match.teams.length
         // ) {

         //    throw new ApiError(
         //       400,
         //       `Placement must be between 1 and ${match.teams.length}`
         //    );

         // }

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