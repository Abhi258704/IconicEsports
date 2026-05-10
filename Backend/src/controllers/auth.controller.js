import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import User from "../models/user.model.js";

const client = new OAuth2Client(
   process.env.GOOGLE_CLIENT_ID
);

const googleLogin = async (req, res) => {

   try {

      console.log("BODY:", req.body);

      const { credential } = req.body;

      if (!credential) {
         return res.status(400).json({
            success: false,
            message: "Credential missing",
         });
      }

      const ticket = await client.verifyIdToken({
         idToken: credential,
         audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      console.log("PAYLOAD:", payload);

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

      return res.status(200).json({
         success: true,
         token,
         user,
      });

   } catch (error) {

      console.log("GOOGLE LOGIN ERROR:");
      console.log(error);

      return res.status(500).json({
         success: false,
         message: error.message,
      });

   }
};

export { googleLogin };