import User from "../models/user.model.js";

import Group
   from "../models/group.model.js";

import { asyncHandler }
   from "../utils/asyncHandler.js";

import { ApiResponse }
   from "../utils/ApiResponse.js";

import { ApiError }
   from "../utils/ApiError.js";

const getCurrentUser =
   asyncHandler(
      async (
         req,
         res
      ) => {

         if (
            !req.user
         ) {

            throw new ApiError(
               401,
               "Unauthorized request"
            );

         }

         return res
            .status(200)
            .json(

               new ApiResponse(
                  200,
                  req.user,
                  "Current user fetched successfully"
               )

            );

      }
   );

/*
PROMOTE
user -> moderator

DEMOTE
moderator -> user
*/

const updateUserRole =
   asyncHandler(
      async (
         req,
         res
      ) => {

         const {
            role
         } =
            req.body;

         if (

            ![
               "user",
               "moderator"
            ].includes(
               role
            )

         ) {

            throw new ApiError(
               400,
               "Invalid role"
            );

         }

         const user =
            await User
               .findById(
                  req.params.id
               );

         if (
            !user
         ) {

            throw new ApiError(
               404,
               "User not found"
            );

         }

         /* prevent admin edits */

         if (
            user.role ===
            "admin"
         ) {

            throw new ApiError(
               403,
               "Cannot modify admin"
            );

         }

         user.role =
            role;

         await user.save();

         return res
            .status(200)
            .json(

               new ApiResponse(

                  200,

                  user,

                  role ===
                     "moderator"

                     ?

                     "User promoted successfully"

                     :

                     "Moderator demoted successfully"

               )

            );

      }
   );

const searchUser =
   asyncHandler(
      async (
         req,
         res
      ) => {

         const {
            email
         } =
            req.query;

         if (
            !email
         ) {

            throw new ApiError(
               400,
               "Email required"
            );

         }

         const user =
            await User
               .findOne({

                  email:
                     email
                        .trim()

               })
               .select(
                  "-password"
               );

         if (
            !user
         ) {

            throw new ApiError(
               404,
               "User not found"
            );

         }

         return res
            .status(200)
            .json(

               new ApiResponse(

                  200,

                  user,

                  "User found"

               )

            );

      }
   );

const getModerators =
   asyncHandler(
      async (
         req,
         res
      ) => {

         const moderators =
            await User
               .find({

                  role:
                     "moderator"

               })

               .select(

                  "name email role"

               )

               .sort({

                  updatedAt: -1

               });

         return res
            .status(200)
            .json(

               new ApiResponse(

                  200,

                  moderators,

                  "Moderators fetched"

               )

            );

      }
   );

const getModerator =
   asyncHandler(
      async (
         req,
         res
      ) => {

         const moderator =
            await User
               .findOne({

                  _id:
                     req.params.id,

                  role:
                     "moderator"

               })

               .select(
                  "name email role"
               );

         if (
            !moderator
         ) {

            throw new ApiError(
               404,
               "Moderator not found"
            );

         }

         const groups =
            await Group
               .find({

                  moderators:
                     moderator._id

               })

               .select(
                  "name round"
               )

               .populate(
                  "round",
                  "name"
               );

         return res
            .status(200)
            .json(

               new ApiResponse(

                  200,

                  {

                     ...moderator.toObject(),

                     assignedGroups:
                        groups,

                  },

                  "Moderator fetched"

               )

            );

      }
   );



export {

   getCurrentUser,

   updateUserRole,

   searchUser,

   getModerators,

   getModerator,
};