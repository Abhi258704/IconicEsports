import { ApiError }
from "../utils/ApiError.js";

const verifyModerator = (
   req,
   res,
   next
) => {

   if (
      req.user.role !== "moderator" &&
      req.user.role !== "admin"
   ) {

      throw new ApiError(
         403,
         "Moderator access required"
      );

   }

   next();
};

export {
   verifyModerator,
};