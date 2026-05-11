import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import { ApiError } from "../utils/ApiError.js";

const getCurrentUser = asyncHandler(
   async (req, res) => {

      if (!req.user) {
         throw new ApiError(
            401,
            "Unauthorized request"
         );
      }

      return res.status(200).json(
         new ApiResponse(
            200,
            req.user,
            "Current user fetched successfully"
         )
      );

   }
);

export {
   getCurrentUser,
};