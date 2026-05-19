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

   // admin bypass

   if (
      req.user.role ===
      "admin"
   ) {

      return next();

   }

   // moderator only

   if (
      req.user.role !==
      "moderator"
   ) {

      throw new ApiError(
         403,
         "Access denied"
      );

   }

   // safer extraction

   let groupId =

      req.body?.groupId ||

      req.body?.currentGroupId ||

      req.params?.id;

   // match routes

   if (
      !groupId &&

      req.originalUrl.includes(
         "/matches/"
      )
   ) {

      const match =

         await Match.findById(
            req.params.id
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

   if (
      !groupId
   ) {

      throw new ApiError(
         400,
         "Group ID required"
      );

   }

   const group =

      await Group.findById(
         groupId
      );

   if (
      !group
   ) {

      throw new ApiError(
         404,
         "Group not found"
      );

   }

   const assigned =

      group
         .moderators
         ?.some(
            id =>

               id.toString() ===

               req.user._id.toString()
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