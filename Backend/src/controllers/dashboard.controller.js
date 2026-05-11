import Tournament
from "../models/tournament.model.js";

import Team
from "../models/team.model.js";

import Match
from "../models/match.model.js";

import { asyncHandler }
from "../utils/asyncHandler.js";

import { ApiResponse }
from "../utils/ApiResponse.js";

const getDashboardStats =
   asyncHandler(async (
      req,
      res
   ) => {

      const totalTournaments =
         await Tournament.countDocuments({
            isDeleted: false,
         });

      const registeredTeams =
         await Team.countDocuments({
            isDeleted: false,
         });

      const pendingVerifications =
         await Team.countDocuments({
            status: "pending",
            isDeleted: false,
         });

      const activeMatches =
         await Match.countDocuments({
            status: "ongoing",
         });

      return res.status(200).json(

         new ApiResponse(
            200,
            {
               totalTournaments,
               registeredTeams,
               pendingVerifications,
               activeMatches,
            },
            "Dashboard stats fetched successfully"
         )

      );

   });

export {
   getDashboardStats,
};
