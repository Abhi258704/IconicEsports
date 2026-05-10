import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const verifyJWT = asyncHandler(async (req, res, next) => {

   const token =
      req.headers.authorization?.replace("Bearer ", "");

   if (!token) {
      throw new ApiError(401, "Unauthorized request");
   }

   const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
   );

   const user = await User.findById(
      decodedToken.id
   ).select("-password");

   if (!user) {
      throw new ApiError(401, "Invalid access token");
   }

   req.user = user;

   next();

});

export { verifyJWT };