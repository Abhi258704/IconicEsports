import Team from "../models/team.model.js";

import Match from "../models/match.model.js";

import Tournament from "../models/tournament.model.js";

import Round from "../models/round.model.js";

import Group from "../models/group.model.js";

import { ApiError }
   from "../utils/ApiError.js";

import {
   withTransaction,
}
   from "../utils/withTransaction.js";


const verifyTeamService =
   async ({ teamId }) => {

      return await withTransaction(
         async (session) => {

            const team =
               await Team.findById(
                  teamId
               ).session(session);

            if (!team) {

               throw new ApiError(
                  404,
                  "Team not found"
               );

            }

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

            team.status =
               "verified";

            const hasTournamentStarted =
               await Match.exists({

                  tournament:
                     team.tournament,

                  status: {
                     $in: [
                        "ongoing",
                        "completed",
                     ],
                  },

               }).session(session);

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

               })
                  .sort({
                     roundNumber: 1,
                  })
                  .session(session);

            if (!activeRound) {

               throw new ApiError(
                  404,
                  "No active round found"
               );

            }

            if (hasTournamentStarted) {

               const rounds =
                  await Round.find({
                     tournament:
                        team.tournament,
                  })
                     .select(
                        "_id name roundNumber"
                     )
                     .sort({
                        roundNumber: 1,
                     })
                     .session(session);

               return {
                  requiresManualPlacement: true,
                  team,
                  rounds,
               };

            }

            const tournament =
               await Tournament.findById(
                  team.tournament
               ).session(session);

            const TEAMS_PER_GROUP =
               tournament
                  .teamsPerGroup || 16;

            const groups =
               await Group.find({

                  round:
                     activeRound._id,

               })
                  .sort({
                     createdAt: 1,
                  })
                  .session(session);

            let group =
               groups.find(

                  (g) =>

                     (
                        g.teams?.length || 0
                     ) <

                     TEAMS_PER_GROUP

               );

            if (!group) {

               const groupCount =
                  await Group.countDocuments({

                     round:
                        activeRound._id,

                  }).session(session);

               const groupName =
                  `Group ${String.fromCharCode(
                     65 + groupCount
                  )}`;

               const createdGroups =
                  await Group.create(
                     [
                        {
                           name:
                              groupName,

                           tournament:
                              team.tournament,

                           round:
                              activeRound._id,

                           teams: [],
                        },
                     ],
                     { session }
                  );

               group =
                  createdGroups[0];

               activeRound.groups =
                  activeRound.groups || [];

               activeRound.groups.push(
                  group._id
               );

               await activeRound.save({
                  session
               });

            }

            group.teams =
               group.teams || [];

            const alreadyExists =
               (
                  group.teams || []
               ).some(

                  (memberId) =>

                     memberId.toString() ===
                     team._id.toString()

               );

            if (!alreadyExists) {

               group.teams = [

                  ...new Set([

                     ...group.teams.map(
                        (id) =>
                           id.toString()
                     ),

                     team._id.toString(),

                  ]),

               ];

            }

            await group.save({
               session
            });

            team.group =
               group._id;

            team.currentRound =
               activeRound._id;

            await team.save({
               session
            });

            return {
               team,
               group,
            };

         }
      );

   };

const manualAssignTeamService =
   async ({
      teamId,
      roundId,
      groupId,
   }) => {

      return await withTransaction(
         async (session) => {

            if (
               !roundId ||
               !groupId
            ) {

               throw new ApiError(
                  400,
                  "Round and group required"
               );

            }

            const team =
               await Team.findById(
                  teamId
               ).session(session);

            if (!team) {

               throw new ApiError(
                  404,
                  "Team not found"
               );

            }

            const group =
               await Group.findById(
                  groupId
               ).session(session);

            if (!group) {

               throw new ApiError(
                  404,
                  "Group not found"
               );

            }

            const alreadyExists =
               group.teams.some(
                  (id) =>
                     id.toString() ===
                     team._id.toString()
               );

            if (alreadyExists) {

               throw new ApiError(
                  400,
                  "Team already exists in group"
               );

            }

            const groupLocked =
               await Match.exists({

                  group: groupId,

                  $or: [

                     {
                        status: {
                           $in: [
                              "ongoing",
                              "completed",
                           ]
                        }
                     },

                     {
                        roomId: {
                           $exists: true,
                           $nin: [
                              null,
                              ""
                           ]
                        }
                     },

                     {
                        roomPassword: {
                           $exists: true,
                           $nin: [
                              null,
                              ""
                           ]
                        }
                     },

                  ],

               }).session(session);

            if (groupLocked) {

               throw new ApiError(

                  400,

                  "Cannot verify team into this group. Match already started."

               );

            }

            team.status =
               "verified";

            team.currentRound =
               roundId;

            team.group =
               groupId;

            await team.save({
               session
            });

            group.teams.push(
               team._id
            );

            await group.save({
               session
            });

            return {
               team,
            };

         }
      );

   };

const rejectTeamService =
   async ({ teamId }) => {

      return await withTransaction(
         async (session) => {

            const team =
               await Team.findById(
                  teamId
               ).session(session);

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

            const playedMatch =
               await Match.findOne({

                  teams: team._id,

                  status: "completed",

               }).session(session);

            if (playedMatch) {

               throw new ApiError(
                  400,
                  "Cannot reject team after matches are played"
               );

            }

            if (team.group) {

               await Group.findByIdAndUpdate(

                  team.group,

                  {
                     $pull: {
                        teams:
                           team._id,
                     },
                  },

                  {
                     session
                  }

               );

               team.group =
                  null;

            }

            team.status =
               "rejected";

            await team.save({
               session
            });

            return team;

         }
      );

   };



export {
   verifyTeamService,
   manualAssignTeamService,
   rejectTeamService,
};