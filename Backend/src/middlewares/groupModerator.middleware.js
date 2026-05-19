import Group from "../models/group.model.js";

import Match from "../models/match.model.js";

import {
   ApiError,
}
   from "../utils/ApiError.js";

const verifyGroupModerator =
   async (
      req,
      res,
      next
   ) => {

      try {

         /* ADMIN */

         if (
            req.user.role ===
            "admin"
         ) {

            return next();

         }

         /* MODERATOR */

         if (
            req.user.role !==
            "moderator"
         ) {

            throw new ApiError(
               403,
               "Access denied"
            );

         }

         /*
         GROUP ROUTES
         /groups/:id
         
         MATCH ROUTES
         /matches/:id
         /matches/group/:id
         */

         let groupId =

            req.body?.groupId ||

            req.body?.currentGroupId;

         /* MATCH ROUTES */

         if (

            !groupId &&

            req.originalUrl.includes(
               "/matches/"
            )

         ) {

            /* GROUP MATCHES */

            if (

               req.originalUrl.includes(
                  "/matches/group/"
               )

            ) {

               groupId =
                  req.params.id;

            }

            /* SINGLE MATCH */

            else {

               const match =

                  await Match
                     .findById(
                        req.params.id
                     )
                     .select(
                        "group"
                     );

               if (
                  !match
               ) {

                  throw new ApiError(
                     404,
                     "Match not found"
                  );

               }

               groupId =
                  match.group;

            }

         }

         /* GROUP ROUTES */

         if (

            !groupId &&

            req.originalUrl.includes(
               "/groups/"
            )

         ) {

            groupId =
               req.params.id;

         }

         /* FINAL CHECK */

         if (
            !groupId
         ) {

            throw new ApiError(
               400,
               "Group ID required"
            );

         }

         /* FIND GROUP */

         const group =

            await Group
               .findById(
                  groupId
               )
               .select(
                  "moderators"
               );

         if (
            !group
         ) {

            throw new ApiError(
               404,
               "Group not found"
            );

         }

         /* VERIFY */

         const assigned =

            group
               .moderators
               ?.some(

                  moderatorId =>

                     moderatorId
                        .toString() ===

                     req.user._id
                        .toString()

               );

         if (
            !assigned
         ) {

            throw new ApiError(
               403,
               "Not assigned to this group"
            );

         }

         next();

      }

      catch (
      error
      ) {

         next(
            error
         );

      }

   };

export {

   verifyGroupModerator,

};