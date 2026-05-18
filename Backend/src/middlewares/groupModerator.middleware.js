import Group from "../models/group.model.js";

import Match from "../models/match.model.js";

import { ApiError }
from "../utils/ApiError.js";

const verifyGroupModerator =
   async (req, res, next) => {

      // admins always allowed
      if (req.user.role === "admin") {
         return next();
      }

      // moderators only
      if (req.user.role !== "moderator") {

         throw new ApiError(
            403,
            "Access denied"
         );

      }

      let groupId =
         req.body.groupId ||
         req.body.currentGroupId;

      // group routes
      if (
         !groupId &&
         req.originalUrl.includes("/groups/")
      ) {

         groupId = req.params.id;

      }

      // match routes
      if (
         !groupId &&
         req.originalUrl.includes("/matches/")
      ) {

         const match =
            await Match.findById(
               req.params.id
            );

         if (!match) {

            throw new ApiError(
               404,
               "Match not found"
            );

         }

         groupId = match.group;

      }

      if (!groupId) {

         throw new ApiError(
            400,
            "Group ID required"
         );

      }

      const group =
         await Group.findById(groupId);

      if (!group) {

         throw new ApiError(
            404,
            "Group not found"
         );

      }

      const isAssigned =
         group.moderators.some(
            (moderatorId) =>

               moderatorId.toString() ===
               req.user._id.toString()
         );

      if (!isAssigned) {

         throw new ApiError(
            403,
            "Not assigned to this group"
         );

      }

      next();

   };

export {
   verifyGroupModerator,
};