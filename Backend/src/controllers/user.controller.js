import User from "../models/user.model.js";

import Team
   from "../models/team.model.js";

import Group
   from "../models/group.model.js";

import Match from "../models/match.model.js";

import { asyncHandler }
   from "../utils/asyncHandler.js";

import { ApiResponse }
   from "../utils/ApiResponse.js";

import { ApiError }
   from "../utils/ApiError.js";

const getCurrentUser =
   asyncHandler(
      async (
         req,
         res
      ) => {

         if (
            !req.user
         ) {

            throw new ApiError(
               401,
               "Unauthorized request"
            );

         }

         return res
            .status(200)
            .json(

               new ApiResponse(
                  200,
                  req.user,
                  "Current user fetched successfully"
               )

            );

      }
   );

/*
PROMOTE
user -> moderator

DEMOTE
moderator -> user
*/

const updateUserRole =
   asyncHandler(
      async (
         req,
         res
      ) => {

         const {
            role
         } =
            req.body;

         if (

            ![
               "user",
               "moderator"
            ].includes(
               role
            )

         ) {

            throw new ApiError(
               400,
               "Invalid role"
            );

         }

         const user =
            await User
               .findById(
                  req.params.id
               );

         if (
            !user
         ) {

            throw new ApiError(
               404,
               "User not found"
            );

         }

         /* prevent admin edits */

         if (
            user.role ===
            "admin"
         ) {

            throw new ApiError(
               403,
               "Cannot modify admin"
            );

         }

         user.role =
            role;

         await user.save();

         return res
            .status(200)
            .json(

               new ApiResponse(

                  200,

                  user,

                  role ===
                     "moderator"

                     ?

                     "User promoted successfully"

                     :

                     "Moderator demoted successfully"

               )

            );

      }
   );

const searchUser =
   asyncHandler(
      async (
         req,
         res
      ) => {

         const {
            email
         } =
            req.query;

         if (
            !email
         ) {

            throw new ApiError(
               400,
               "Email required"
            );

         }

         const user =
            await User
               .findOne({

                  email:
                     email
                        .trim()

               })
               .select(
                  "-password"
               );

         if (
            !user
         ) {

            throw new ApiError(
               404,
               "User not found"
            );

         }

         return res
            .status(200)
            .json(

               new ApiResponse(

                  200,

                  user,

                  "User found"

               )

            );

      }
   );

const getModerators =
   asyncHandler(
      async (
         req,
         res
      ) => {

         const moderators =
            await User
               .find({

                  role:
                     "moderator"

               })

               .select(

                  "name email role"

               )

               .sort({

                  updatedAt: -1

               });

         return res
            .status(200)
            .json(

               new ApiResponse(

                  200,

                  moderators,

                  "Moderators fetched"

               )

            );

      }
   );

const getModerator =
   asyncHandler(
      async (
         req,
         res
      ) => {

         const moderator =
            await User
               .findOne({

                  _id:
                     req.params.id,

                  role:
                     "moderator"

               })

               .select(
                  "name email role"
               );

         if (
            !moderator
         ) {

            throw new ApiError(
               404,
               "Moderator not found"
            );

         }

         const groups =
            await Group
               .find({

                  moderators:
                     moderator._id

               })

               .select(
                  "name round"
               )

               .populate(
                  "round",
                  "name"
               );

         return res
            .status(200)
            .json(

               new ApiResponse(

                  200,

                  {

                     ...moderator.toObject(),

                     assignedGroups:
                        groups,

                  },

                  "Moderator fetched"

               )

            );

      }
   );

const getMyTeams =
   asyncHandler(

      async (
         req,
         res
      ) => {

         const teams =

            await Team.find({

               registeredBy:
                  req.user._id,

               isDeleted:
                  false,

            })

               .populate(

                  "tournament",

                  "name banner"

               )

               .sort({

                  createdAt:
                     -1,

               });

         return res

            .status(
               200
            )

            .json(

               new ApiResponse(

                  200,

                  teams,

                  "My teams fetched"

               )

            );

      }

   );

const getCurrentMatch =
   asyncHandler(async (
      req,
      res
   ) => {

      const {
         teamId
      } =
         req.params;

      const team =
         await Team.findOne({

            _id:
               teamId,

            registeredBy:
               req.user._id,

         });

      if (
         !team
      ) {

         throw new ApiError(
            404,
            "Team not found"
         );

      }

      if (
         !team.group
      ) {

         return res.status(200).json(

            new ApiResponse(
               200,
               null,
               "No match"
            )

         );

      }

      let match =

         await Match.findOne({

            group:
               team.group,

            roomId: {

               $exists:
                  true,

               $ne:
                  "",

            },

            roomPassword: {

               $exists:
                  true,

               $ne:
                  "",

            },

            status: {

               $ne:
                  "completed",

            },

         })

            .sort({

               scheduledAt:
                  -1,

            });

      if (

         !match

      ) {

         match =

            await Match.findOne({

               group:
                  team.group,

               status: {

                  $ne:
                     "completed",

               },

            })

               .sort({

                  scheduledAt:
                     -1,

               });

      }

      if (
         match
      ) {

         const fullTeam =

            await Team.findById(
               teamId
            );

         let slot =
            null;

         if (
            fullTeam?.group
         ) {

            const group =

               await Group.findById(

                  fullTeam.group

               )

                  .select(
                     "teams"
                  )

                  .lean();

            const index =

               group?.teams
                  ?.findIndex(

                     id =>

                        String(id)

                        ===

                        String(
                           fullTeam._id
                        )

                  );

            slot =

               index >= 0

                  ?

                  index + 4

                  :

                  null;

         }

         match =
            match.toObject();

         match.slot =
            slot;

      }

      return res.status(200).json(

         new ApiResponse(

            200,

            match,

            "Current match"

         )

      );

   });

const getAllMatches =
   asyncHandler(

      async (
         req,
         res
      ) => {

         const {
            teamId
         } =
            req.params;

         const team =

            await Team.findOne({

               _id:
                  teamId,

               registeredBy:
                  req.user._id,

            })

               .populate(
                  "group",
                  "name"
               )

               .populate(
                  "currentRound",
                  "name roundNumber"
               );

         if (
            !team
         ) {

            throw new ApiError(
               404,
               "Team not found"
            );

         }

         if (

            !team.currentRound

            ||

            !team.group

         ) {

            return res.status(200).json(

               new ApiResponse(

                  200,

                  {

                     round:
                        team.currentRound,

                     group:
                        team.group,

                     matches:
                        [],

                  },

                  "No matches"

               )

            );

         }

         const matches =

            await Match.find({

               round:
                  team.currentRound._id,

               group:
                  team.group._id,

            })

               .select(

                  `
matchNumber
map
roomId
roomPassword
scheduledAt
startTime
status
`

               )

               .sort({

                  matchNumber:
                     1,

               });

         let slot =
            null;

         const groupDoc =

            await Group.findById(
               team.group._id
            )

               .select(
                  "teams"
               )

               .lean();

         const index =

            groupDoc?.teams
               ?.findIndex(

                  id =>

                     String(id)

                     ===

                     String(
                        team._id
                     )

               );

         slot =

            index >= 0

               ?

               index + 4

               :

               null;

         return res.status(200).json(

            new ApiResponse(

               200,

               {

                  round:
                     team.currentRound,

                  group:
                     team.group,

                  slot,

                  matches,

               },

               "Matches fetched"

            )

         );

      }
   );

const getResultsHistory =
   asyncHandler(

      async (
         req,
         res
      ) => {

         const {
            teamId
         } =
            req.params;

         const team =

            await Team.findOne({

               _id:
                  teamId,

               registeredBy:
                  req.user._id,

            });

         if (
            !team
         ) {

            throw new ApiError(
               404,
               "Team not found"
            );

         }

         const matches =

            await Match.find({

               "results.team":
                  team._id,

               status:
                  "completed",

            })

               .populate(
                  "group",
                  "name round"
               )

               .populate(
                  {
                     path:
                        "round",

                     select:
                        "name roundNumber",
                  }

               )

               .select(

                  `
matchNumber
group
round
status
`

               )

               .sort({

                  createdAt:
                     1,

               });

         const grouped =
            new Map();

         matches.forEach(

            match => {

               const key =

                  `${match.round?._id}-${match.group?._id}`;

               if (

                  !grouped.has(
                     key
                  )

               ) {

                  grouped.set(

                     key,

                     {

                        round:
                           match.round,

                        group:
                           match.group,

                        matchCount:
                           0,

                     },

                  );

               }

               grouped.get(
                  key
               )
                  .matchCount++;

            }

         );

         return res

            .status(
               200
            )

            .json(

               new ApiResponse(

                  200,

                  [

                     ...grouped.values()

                  ],

                  "Results history"

               )

            );

      }

   );
// const getMyTeamMatches = asyncHandler(
//    async (req, res) => {

//       const { teamId } = req.params;

//       const team =
//          await Team.findOne({
//             _id: teamId,
//             registeredBy: req.user._id,
//          });

//       if (!team) {
//          throw new ApiError(
//             404,
//             "Team not found"
//          );
//       }

//       if (!team.group) {

//          return res.status(200).json(
//             new ApiResponse(
//                200,
//                [],
//                "No matches yet"
//             )
//          );

//       }

//       const matches =
//          await Match.find({

//             group:
//                team.group,

//          })

//             .sort({
//                matchNumber: 1,
//             })

//             .select(
//                `
// name
// matchNumber
// map
// roomId
// roomPassword
// scheduledAt
// startTime
// status
// results
// `
//             );

//       return res.status(200).json(

//          new ApiResponse(
//             200,
//             matches,
//             "Matches fetched"
//          )

//       );

//    });


export {

   getCurrentUser,

   updateUserRole,

   searchUser,

   getModerators,

   getModerator,

   getMyTeams,

   getCurrentMatch,

   getAllMatches,

   getResultsHistory,
};