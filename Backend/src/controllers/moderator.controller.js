import Group from "../models/group.model.js";

import Match from "../models/match.model.js";

import { asyncHandler }
from "../utils/asyncHandler.js";

const getModeratorGroups =
   asyncHandler(async (
      req,
      res
   ) => {

      const groups =
         await Group.find({

            moderators:
               req.user._id,

         })

         .populate("round")
         .populate("tournament");

      return res.status(200).json({

         success: true,

         data: groups,

      });

   });

const getModeratorMatches =
   asyncHandler(async (
      req,
      res
   ) => {

      const groups =
         await Group.find({

            moderators:
               req.user._id,

         }).select("_id");

      const groupIds =
         groups.map(
            group => group._id
         );

      const matches =
         await Match.find({

            group: {
               $in: groupIds,
            },

         })

         .populate("group")
         .populate("round");

      return res.status(200).json({

         success: true,

         data: matches,

      });

   });

export {
   getModeratorGroups,
   getModeratorMatches,
};