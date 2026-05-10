import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import User from "../models/user.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const client = new OAuth2Client(
   process.env.GOOGLE_CLIENT_ID
);

const googleLogin = asyncHandler(async (req, res) => {

   const { credential } = req.body;

   if (!credential) {
      throw new ApiError(400, "Credential missing");
   }

   const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
   });

   const payload = ticket.getPayload();

   const {
      sub,
      email,
      name,
      picture,
   } = payload;

   let user = await User.findOne({ email });

   if (!user) {

      user = await User.create({
         googleId: sub,
         name,
         email,
         avatar: picture,
      });

   }

   const token = jwt.sign(
      {
         id: user._id,
      },
      process.env.JWT_SECRET,
      {
         expiresIn: "7d",
      }
   );

   return res.status(200).json(
      new ApiResponse(
         200,
         {
            token,
            user,
         },
         "Google login successful"
      )
   );

});

export { googleLogin };