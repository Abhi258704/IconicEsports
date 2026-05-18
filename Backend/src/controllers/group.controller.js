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

import {
   generateGroupsService,
   moveTeamsToGroupService,
   moveTeamsToNextRoundService,
   rollbackQualificationService,
   assignModeratorToGroupService,
}
from "../services/group.service.js";




const generateGroups = asyncHandler(
   async (req, res) => {

      const {
         tournamentId,
         roundId,
      } = req.body;

      const createdGroups =
         await generateGroupsService({

            tournamentId,

            roundId,

         });

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

const getGroupById = asyncHandler(
   async (req, res) => {

      const { id } =
         req.params;

      const group =
         await Group.findById(id)

            .populate("teams")

            .populate("round");

      if (!group) {

         throw new ApiError(
            404,
            "Group not found"
         );

      }

      return res.status(200).json(

         new ApiResponse(
            200,
            group,
            "Group fetched successfully"
         )

      );

   }
);

const moveTeamsToGroup = asyncHandler(
   async (req, res) => {

      const {
         teamIds,
         fromGroupId,
         toGroupId,
      } = req.body;

      await moveTeamsToGroupService({

         teamIds,

         fromGroupId,

         toGroupId,

      });

      return res.status(200).json(

         new ApiResponse(
            200,
            {},
            "Teams moved successfully"
         )

      );

   }
);

const moveTeamsToNextRound = asyncHandler(
   async (req, res) => {

      const {
         id: currentGroupId
      } = req.params;

      const {
         nextRoundId,
         selectedTeamIds,
      } = req.body;

      await moveTeamsToNextRoundService({

         currentGroupId,

         nextRoundId,

         selectedTeamIds,

      });

      return res.status(200).json(

         new ApiResponse(
            200,
            {},
            "Teams moved successfully"
         )

      );

   }
);

const rollbackQualification = asyncHandler(
   async (req, res) => {

      const {
         id: currentGroupId
      } = req.params;

      await rollbackQualificationService({
         currentGroupId,
      });

      return res.status(200).json(

         new ApiResponse(
            200,
            {},
            "Rollback successful"
         )

      );

   }
);

const assignModeratorToGroup = asyncHandler(async (
      req,
      res
   ) => {

      const group =
         await assignModeratorToGroupService({

            groupId:
               req.params.id,

            moderatorId:
               req.body.moderatorId,

         });

      return res.status(200).json({

         success: true,

         message:
            "Moderator assigned successfully",

         data: group,

      });

   });


export {
   generateGroups,
   getRoundGroups,
   getGroupLeaderboard,
   getGroupById,
   moveTeamsToGroup,
   moveTeamsToNextRound,
   rollbackQualification,
   assignModeratorToGroup,
};