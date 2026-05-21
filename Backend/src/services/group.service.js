import Group from "../models/group.model.js";

import Round from "../models/round.model.js";

import Team from "../models/team.model.js";

import Match from "../models/match.model.js";

import User from "../models/user.model.js";

import Tournament
   from "../models/tournament.model.js";

import { ApiError }
   from "../utils/ApiError.js";

import {
   withTransaction,
}
   from "../utils/withTransaction.js";


const generateGroupsService =
   async ({
      tournamentId,
      roundId,
   }) => {

      return await withTransaction(
         async (session) => {

            const round =
               await Round.findById(
                  roundId
               ).session(session);

            if (!round) {

               throw new ApiError(
                  404,
                  "Round not found"
               );

            }

            const existingGroups =
               await Group.find({
                  round: roundId,
               }).session(session);

            if (
               existingGroups.length > 0
            ) {

               throw new ApiError(
                  400,
                  "Groups already generated"
               );

            }

            const tournament =
               await Tournament.findById(
                  tournamentId
               ).session(session);

            if (!tournament) {

               throw new ApiError(
                  404,
                  "Tournament not found"
               );

            }

            let teams = [];

            // ROUND 1

            if (!round.previousRound) {

               teams =
                  await Team.find({

                     tournament:
                        tournamentId,

                     status:
                        "verified",

                     isDeleted:
                        false,

                  }).session(session);

            }

            // NEXT ROUNDS

            else {

               teams =
                  await Team.find({

                     tournament:
                        tournamentId,

                     qualifiedRounds:
                        round.previousRound,

                     isDeleted:
                        false,

                  }).session(session);

            }

            if (teams.length === 0) {

               throw new ApiError(
                  400,
                  "No eligible teams found"
               );

            }

            teams.sort(
               () =>
                  Math.random() - 0.5
            );

            const TEAMS_PER_GROUP =
               tournament.teamsPerGroup ||
               16;

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

                     i *
                     TEAMS_PER_GROUP,

                     (i + 1) *
                     TEAMS_PER_GROUP

                  );

               const created =
                  await Group.create(
                     [
                        {
                           name:
                              groupName,

                           tournament:
                              tournamentId,

                           round:
                              roundId,

                           teams:
                              groupTeams.map(
                                 (team) =>
                                    team._id
                              ),
                        },
                     ],
                     { session }
                  );

               const group =
                  created[0];

               for (
                  const team
                  of groupTeams
               ) {

                  team.group =
                     group._id;

                  team.currentRound =
                     roundId;

                  await team.save({
                     session
                  });

               }

               round.groups.push(
                  group._id
               );

               createdGroups.push(
                  group
               );

            }

            await round.save({
               session
            });

            return createdGroups;

         }
      );

   };

const moveTeamsToGroupService =
   async ({
      teamIds,
      fromGroupId,
      toGroupId,
   }) => {

      return await withTransaction(
         async (session) => {

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

            if (
               fromGroupId ===
               toGroupId
            ) {

               throw new ApiError(
                  400,
                  "Source and target groups cannot be same"
               );

            }

            const fromGroup =
               await Group.findById(
                  fromGroupId
               ).session(session);

            const toGroup =
               await Group.findById(
                  toGroupId
               ).session(session);

            if (
               !fromGroup ||
               !toGroup
            ) {

               throw new ApiError(
                  404,
                  "Group not found"
               );

            }

            const hasIdp =

               await Match.exists({

                  group:
                     fromGroupId,

                  $or: [

                     {

                        roomId: {

                           $exists: true,

                           $ne: "",

                        },

                     },

                     {

                        roomPassword: {

                           $exists: true,

                           $ne: "",

                        },

                     },

                  ],

               }).session(
                  session
               );

            if (
               hasIdp
            ) {

               throw new ApiError(

                  400,

                  "Cannot move teams after IDP release"

               );

            }

            for (
               const teamId
               of teamIds
            ) {

               const exists =
                  toGroup.teams.some(
                     (id) =>
                        id.toString() ===
                        teamId.toString()
                  );

               if (!exists) {

                  toGroup.teams.push(
                     teamId
                  );

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

            await fromGroup.save({
               session
            });

            await toGroup.save({
               session
            });

            await Team.updateMany(
               {
                  _id: {
                     $in:
                        teamIds
                  }
               },
               {
                  group:
                     toGroup._id
               },
               {
                  session
               }
            );

            return {
               fromGroup,
               toGroup,
            };

         }
      );

   };

const moveTeamsToNextRoundService =
   async ({
      currentGroupId,
      nextRoundId,
      selectedTeamIds,
   }) => {

      try {
         return await withTransaction(
            async (session) => {

               const currentGroup =
                  await Group.findById(
                     currentGroupId
                  )
                     .populate("round")
                     .session(session);

               if (!currentGroup) {

                  throw new ApiError(
                     404,
                     "Current group not found"
                  );

               }

               if (
                  currentGroup.qualificationLocked
               ) {

                  throw new ApiError(
                     400,
                     "Qualification already locked"
                  );

               }

               const nextRound =
                  await Round.findById(
                     nextRoundId
                  ).session(session);

               if (!nextRound) {

                  throw new ApiError(
                     404,
                     "Next round not found"
                  );

               }

               const qualificationLimit =
                  currentGroup.round
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
                  }).session(session);

               for (
                  const teamId
                  of selectedTeamIds
               ) {

                  const existingTeam =
                     await Team.findById(
                        teamId
                     ).session(session);

                  if (!existingTeam) {

                     throw new ApiError(
                        404,
                        "Team not found"
                     );

                  }

                  if (
                     existingTeam.currentRound?.toString() ===
                     nextRoundId.toString()
                  ) {

                     continue;

                  }

                  let availableGroup =
                     nextGroups.find(
                        g =>
                           (
                              g.teams?.length || 0
                           ) <
                           (
                              g.maxTeams || 16
                           )
                     );

                  if (
                     !availableGroup
                  ) {

                     const created =
                        await Group.create(
                           [
                              {
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
                              }
                           ],
                           {
                              session
                           }
                        );

                     availableGroup =
                        created[0];

                     nextGroups.push(
                        availableGroup
                     );

                     nextRound.groups.push(
                        availableGroup._id
                     );

                     await nextRound.save({
                        session,
                        validateModifiedOnly:
                           true,
                     });

                  }

                  availableGroup.teams.push(
                     teamId
                  );

                  await availableGroup.save({
                     session,
                     validateModifiedOnly:
                        true,
                  });

                  await Team.findByIdAndUpdate(

                     teamId,

                     {

                        $set: {

                           group:
                              availableGroup._id,

                           currentRound:
                              nextRoundId,

                           isEliminated:
                              false,

                           eliminatedInRound:
                              null,

                        },

                        $addToSet: {

                           qualifiedRounds:
                              currentGroup.round._id,

                        },

                     },

                     {

                        session,

                        runValidators:
                           true,

                     }

                  );

               }

               const eliminatedTeams =
                  currentGroup.teams.filter(
                     id =>
                        !selectedTeamIds.some(
                           selected =>
                              selected.toString() ===
                              id.toString()
                        )
                  );

               if (
                  eliminatedTeams.length
               ) {

                  await Team.updateMany(

                     {
                        _id: {
                           $in:
                              eliminatedTeams
                        }
                     },

                     {

                        $set: {

                           isEliminated:
                              true,

                           eliminatedInRound:
                              currentGroup.round._id,

                           group:
                              null,

                        }

                     },

                     {
                        session
                     }

                  );

               }

               currentGroup.qualificationLocked =
                  true;

               currentGroup.qualifiedTeams =
                  selectedTeamIds;

               currentGroup.movedToRound =
                  nextRoundId;

               await currentGroup.save({
                  session,
                  validateModifiedOnly:
                     true,
               });

               return {

                  success:
                     true,

                  moved:
                     selectedTeamIds.length,

                  nextRound:
                     nextRound._id,

               };

            }
         );
      } catch (error) {

         console.log("\n====== MOVE ROUND ERROR ======");

         console.log("MESSAGE:");
         console.log(err.message);

         console.log("NAME:");
         console.log(err.name);

         console.log("STACK:");
         console.log(err.stack);

         console.log("ERRORS:");
         console.log(err.errors);

         console.log("FULL:");

         console.dir(
            err,
            {
               depth: 10
            }
         );

         throw err;

      }
   };

const rollbackQualificationService =
   async ({
      currentGroupId,
   }) => {

      await withTransaction(
         async (session) => {

            const currentGroup =
               await Group.findById(
                  currentGroupId
               ).session(session);

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
               }).session(session);

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
               }).session(session);

            const hasStarted =
               nextRoundMatches.some(
                  match =>
                     match.roomId ||
                     match.status ===
                     "completed"
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
               },
               {
                  session
               }
            );

            await Group.deleteMany(
               {
                  round:
                     currentGroup.movedToRound,
                  teams: {
                     $size: 0
                  }
               },
               {
                  session
               }
            );

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
               },
               {
                  session
               }
            );

            currentGroup.qualificationLocked =
               false;

            currentGroup.qualifiedTeams =
               [];

            currentGroup.movedToRound =
               null;

            await currentGroup.save({
               session
            });

         }
      );

   };

const assignModeratorToGroupService =
   async ({
      groupId,
      moderatorId,
   }) => {

      return await withTransaction(
         async (session) => {

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

            const moderator =
               await User.findById(
                  moderatorId
               ).session(session);

            if (!moderator) {

               throw new ApiError(
                  404,
                  "Moderator not found"
               );

            }

            if (
               moderator.role !==
               "moderator"
            ) {

               throw new ApiError(
                  400,
                  "User is not a moderator"
               );

            }

            const alreadyAssigned =
               group.moderators.some(
                  (id) =>

                     id.toString() ===
                     moderatorId.toString()
               );

            if (alreadyAssigned) {

               throw new ApiError(
                  400,
                  "Moderator already assigned"
               );

            }

            group.moderators.push(
               moderatorId
            );

            await group.save({
               session
            });

            return group;

         }
      );

   };




export {
   generateGroupsService,
   moveTeamsToGroupService,
   moveTeamsToNextRoundService,
   rollbackQualificationService,
   assignModeratorToGroupService,
};