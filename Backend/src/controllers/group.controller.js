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

      if (
         !teamIds?.length ||
         !fromGroupId ||
         !toGroupId
      ) {

         throw new ApiError(
            400,
            "Missing required fields"
         );

      }

      if (fromGroupId === toGroupId) {

         throw new ApiError(
            400,
            "Source and target groups cannot be same"
         );

      }

      const fromGroup =
         await Group.findById(fromGroupId);

      const toGroup =
         await Group.findById(toGroupId);

      if (!fromGroup || !toGroup) {

         throw new ApiError(
            404,
            "Group not found"
         );

      }

      for (const teamId of teamIds) {

         const exists =
            toGroup.teams.some(
               (id) =>
                  id.toString() ===
                  teamId.toString()
            );

         if (!exists) {

            toGroup.teams.push(teamId);

         }

      }

      fromGroup.teams =
         fromGroup.teams.filter(
            (id) =>
               !teamIds.some(
                  (teamId) =>
                     teamId.toString() ===
                     id.toString()
               )
         );

      await fromGroup.save();

      await toGroup.save();

      await Team.updateMany(
         {
            _id: { $in: teamIds }
         },
         {
            group: toGroup._id
         }
      );

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

      const currentGroup =
         await Group.findById(
            currentGroupId
         ).populate("round");

      if (!currentGroup) {

         throw new ApiError(
            404,
            "Current group not found"
         );

      }

      const nextRound =
         await Round.findById(
            nextRoundId
         );

      if (!nextRound) {

         throw new ApiError(
            404,
            "Next round not found"
         );

      }

      const qualificationLimit =
         currentGroup?.round
            ?.qualificationCount || 0;

      if (
         selectedTeamIds.length !==
         qualificationLimit
      ) {

         throw new ApiError(
            400,
            `Select exactly ${qualificationLimit} teams`
         );

      }

      let nextGroups =
         await Group.find({
            round:
               nextRoundId,
         });

      for (
         const teamId of selectedTeamIds
      ) {

         let availableGroup =
            nextGroups.find(
               group =>
                  (
                     group.teams?.length || 0
                  ) < 16
            );

         if (
            !availableGroup
         ) {

            const newGroup =
               await Group.create({

                  tournament:
                     currentGroup.tournament,

                  round:
                     nextRoundId,

                  name:
                     `Group ${String.fromCharCode(
                        65 +
                        nextGroups.length
                     )}`,

                  teams: [],

               });

            nextGroups.push(
               newGroup
            );

            nextRound.groups =
               nextRound.groups || [];

            nextRound.groups.push(
               newGroup._id
            );

            await nextRound.save();

            availableGroup =
               newGroup;

         }

         availableGroup.teams.push(
            teamId
         );

         await availableGroup.save();

         await Team.findByIdAndUpdate(
            teamId,
            {
               group:
                  availableGroup._id,

               currentRound:
                  nextRoundId,

               isEliminated: false,

               eliminatedInRound: null,
            }
         );

      }

      const eliminatedTeams =
         currentGroup.teams.filter(
            teamId =>
               !selectedTeamIds.some(
                  selectedId =>
                     selectedId.toString() ===
                     teamId.toString()
               )
         );

      await Team.updateMany(
         {
            _id: {
               $in: eliminatedTeams
            }
         },
         {
            isEliminated: true,

            eliminatedInRound:
               currentGroup.round._id,

            group: null,
         }
      );

      currentGroup.qualificationLocked =
         true;

      currentGroup.qualifiedTeams =
         selectedTeamIds;

      currentGroup.movedToRound =
         nextRoundId;

      await currentGroup.save();

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

      const currentGroup =
         await Group.findById(
            currentGroupId
         );

      if (!currentGroup) {

         throw new ApiError(
            404,
            "Group not found"
         );

      }

      if (
         !currentGroup.qualificationLocked
      ) {

         throw new ApiError(
            400,
            "Qualification already unlocked"
         );

      }

      const nextRoundGroups =
         await Group.find({
            round:
               currentGroup.movedToRound,
         });

      const nextRoundGroupIds =
         nextRoundGroups.map(
            group => group._id
         );

      const nextRoundMatches =
         await Match.find({
            group: {
               $in:
                  nextRoundGroupIds
            }
         });

      const hasStarted =
         nextRoundMatches.some(
            match =>
               match.roomId ||
               match.status === "completed"
         );

      if (hasStarted) {

         throw new ApiError(
            400,
            "Cannot rollback. Next round already started."
         );

      }

      await Group.updateMany(
         {
            round:
               currentGroup.movedToRound,
         },
         {
            $pull: {
               teams: {
                  $in:
                     currentGroup.qualifiedTeams
               }
            }
         }
      );

      await Group.deleteMany({
         round:
            currentGroup.movedToRound,
         teams: {
            $size: 0
         }
      });

      await Team.updateMany(
         {
            _id: {
               $in:
                  currentGroup.teams
            }
         },
         {
            isEliminated: false,

            eliminatedInRound: null,

            group: currentGroup._id,
         }
      );

      // await Team.updateMany(
      //    {
      //       _id: {
      //          $in:
      //             currentGroup.qualifiedTeams
      //       }
      //    },
      //    {
      //       currentRound:
      //          currentGroup.round
      //    }
      // );

      currentGroup.qualificationLocked =
         false;

      currentGroup.qualifiedTeams =
         [];

      currentGroup.movedToRound =
         null;

      await currentGroup.save();

      return res.status(200).json(

         new ApiResponse(
            200,
            {},
            "Rollback successful"
         )

      );

   }
);


export {
   generateGroups,
   getRoundGroups,
   getGroupLeaderboard,
   getGroupById,
   moveTeamsToGroup,
   moveTeamsToNextRound,
   rollbackQualification,
};