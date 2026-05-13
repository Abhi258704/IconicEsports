import Tournament from "../models/tournament.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import { ApiError } from "../utils/ApiError.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";

import Team from "../models/team.model.js";

import Round from "../models/round.model.js";





const createTournament = asyncHandler(
    async (req, res) => {

        const {
            name,
            game,
            prizePool,
            entryFee,
            maxTeams,
            teamSize,
            teamsPerGroup,
            maps,
            rules,
            startDate,
        } = req.body;

        const parsedMaps =
            JSON.parse(maps);

        if (!name || !prizePool) {
            throw new ApiError(
                400,
                "Name and prize pool are required"
            );
        }

        const bannerLocalPath =
            req.file?.path;

        if (!bannerLocalPath) {

            throw new ApiError(
                400,
                "Tournament banner is required"
            );

        }

        const banner =
            await uploadOnCloudinary(
                bannerLocalPath
            );

        if (!banner) {

            throw new ApiError(
                400,
                "Banner upload failed"
            );

        }


        const tournament =
            await Tournament.create({
                name,
                game,
                prizePool,
                entryFee,
                maxTeams,
                teamSize,
                teamsPerGroup,
                maps: parsedMaps,
                banner: banner.url,
                rules,
                startDate,
                createdBy: req.user._id,
            });

        return res.status(201).json(
            new ApiResponse(
                201,
                tournament,
                "Tournament created successfully"
            )
        );

    }
);

const getAllTournaments = asyncHandler(
    async (req, res) => {

        const tournaments =
            await Tournament.find({
                isDeleted: false,
            })
                .populate(
                    "createdBy",
                    "name email avatar"
                )
                .sort({ createdAt: -1 });

        return res.status(200).json(
            new ApiResponse(
                200,
                tournaments,
                "Tournaments fetched successfully"
            )
        );

    }
);

const getTournamentById = asyncHandler(
      async (req, res) => {

         const { id } =
            req.params;

         const tournament =
            await Tournament.findById(id);

         if (!tournament) {

            throw new ApiError(
               404,
               "Tournament not found"
            );

         }

         /* STATS */

         const totalTeams =
            await Team.countDocuments({

               tournament: id,

               isDeleted: false,

            });

         const verifiedTeams =
            await Team.countDocuments({

               tournament: id,

               status: "verified",

               isDeleted: false,

            });

         const pendingTeams =
            await Team.countDocuments({

               tournament: id,

               status: "pending",

               isDeleted: false,

            });

         const totalRounds =
            await Round.countDocuments({
               tournament: id,
            });

         return res.status(200).json(

            new ApiResponse(
               200,
               {

                  tournament,

                  stats: {

                     totalTeams,

                     verifiedTeams,

                     pendingTeams,

                     totalRounds,

                  },

               },
               "Tournament fetched successfully"
            )

         );

      }
   );

const deleteTournament = asyncHandler(
    async (req, res) => {

        const { id } = req.params;

        const tournament =
            await Tournament.findById(id);

        if (!tournament) {
            throw new ApiError(
                404,
                "Tournament not found"
            );
        }

        tournament.isDeleted = true;

        await tournament.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Tournament deleted successfully"
            )
        );

    }
);

const updateTournament = asyncHandler(
   async (req, res) => {

      const { id } = req.params;

      const tournament =
         await Tournament.findById(id);

      if (!tournament) {

         throw new ApiError(
            404,
            "Tournament not found"
         );

      }

      const {
         name,
         prizePool,
         entryFee,
         maxTeams,
         teamSize,
         maps,
         rules,
         startDate,
         status,
      } = req.body;

      const parsedMaps =
         JSON.parse(maps);

      /* BASIC FIELDS */

      tournament.name =
         name || tournament.name;

      tournament.prizePool =
         prizePool ||
         tournament.prizePool;

      tournament.entryFee =
         entryFee ||
         tournament.entryFee;

      tournament.maxTeams =
         maxTeams ||
         tournament.maxTeams;

      tournament.teamSize =
         teamSize ||
         tournament.teamSize;

      tournament.rules =
         rules || tournament.rules;

      tournament.startDate =
         startDate ||
         tournament.startDate;

      tournament.maps =
         parsedMaps ||
         tournament.maps;

      tournament.status =
         status ||
         tournament.status;

      /* BANNER */

      if (req.file) {

         const banner =
            await uploadOnCloudinary(
               req.file.path
            );

         tournament.banner =
            banner.url;

      }

      await tournament.save();

      return res.status(200).json(

         new ApiResponse(
            200,
            tournament,
            "Tournament updated successfully"
         )

      );

   }
);

const getTournamentTeamsData = asyncHandler(
      async (req, res) => {

         const { id } =
            req.params;

         /* GROUPS */

         const groups =
            await Group.find({
               tournament: id,
            })

            .populate("teams")

            .sort({
               createdAt: 1,
            });

         /* PENDING */

         const pendingTeams =
            await Team.find({

               tournament: id,

               status: "pending",

               isDeleted: false,

            }).sort({
               createdAt: -1,
            });

         return res.status(200).json(

            new ApiResponse(
               200,
               {
                  groups,
                  pendingTeams,
               },
               "Tournament team data fetched successfully"
            )

         );

      }
   );






export {
    createTournament,
    getAllTournaments,
    getTournamentById,
    deleteTournament,
    updateTournament,
    getTournamentTeamsData,
};