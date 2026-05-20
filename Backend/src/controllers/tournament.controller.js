import Tournament from "../models/tournament.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import { ApiError } from "../utils/ApiError.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";

import Team from "../models/team.model.js";

import Round from "../models/round.model.js";

import Group from "../models/group.model.js";

import Match from "../models/match.model.js";

import ExcelJS from "exceljs";




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

      let parsedMaps = [];

      try {

         parsedMaps = JSON.parse(maps);

      } catch {

         throw new ApiError(
            400,
            "Invalid maps format"
         );

      }

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
         await Tournament.aggregate([

            {
               $match: {
                  isDeleted: false,
               },
            },

            {
               $lookup: {
                  from: "teams",
                  localField: "_id",
                  foreignField: "tournament",
                  as: "teams",
               },
            },

            {
               $lookup: {
                  from: "users",
                  localField: "createdBy",
                  foreignField: "_id",
                  as: "createdBy",
               },
            },

            {
               $unwind: {
                  path: "$createdBy",
                  preserveNullAndEmptyArrays: true,
               },
            },

            {
               $addFields: {
                  totalTeams: {
                     $size: "$teams",
                  },
               },
            },

            {
               $project: {

                  teams: 0,

                  "createdBy.password": 0,

                  "createdBy.refreshToken": 0,

               },
            },

            {
               $sort: {
                  createdAt: -1,
               },
            },

         ]);

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

const exportTournamentTeams =
   asyncHandler(

      async (
         req,
         res
      ) => {

         const {
            id
         } =
            req.params;

         const teams =

            await Team.find({

               tournament:
                  id,

               isDeleted:
                  false,

            })

               .populate(
                  "group",
                  "name"
               )

               .populate(
                  "currentRound",
                  "name"
               )

               .sort({
                  createdAt:
                     1,
               });

         const workbook =
            new ExcelJS.Workbook();

         const sheet =

            workbook.addWorksheet(
               "Teams"
            );

         sheet.columns = [

            {
               header:
                  "Team",
               key:
                  "teamName",
               width:
                  30,
            },

            {
               header:
                  "Leader",
               key:
                  "leader",
               width:
                  25,
            },

            {
               header:
                  "Phone",
               key:
                  "phone",
               width:
                  18,
            },

            {
               header:
                  "Status",
               key:
                  "status",
               width:
                  16,
            },

            {
               header:
                  "Tournament Status",
               key:
                  "tournamentStatus",
               width:
                  20,
            },

            {
               header:
                  "Round",
               key:
                  "round",
               width:
                  20,
            },

            {
               header:
                  "Group",
               key:
                  "group",
               width:
                  18,
            },

            {
               header:
                  "Players",
               key:
                  "players",
               width:
                  80,
            },

         ];

         teams.forEach(

            team => {

               sheet.addRow({

                  teamName:
                     team.teamName,

                  leader:
                     team.leaderName,

                  phone:
                     team.leaderPhone,

                  status:
                     team.status,

                  tournamentStatus:

                     team.isEliminated

                        ?

                        "Eliminated"

                        :

                        team.status ===
                           "verified"

                           ?

                           "Playing"

                           :

                           "-",

                  round:

                     team.currentRound
                        ?.name

                     ||

                     team.eliminatedInRound
                        ?.name

                     ||

                     "-",

                  group:

                     team.group
                        ?.name

                     ||

                     "-",

                  players:

                     team.players

                        ?.map(

                           p =>

                              `${p.ign

                              ||

                              "-"

                              }

${p.uid

                                 ?

                                 ` (${p.uid})`

                                 :

                                 ""

                              }`

                        )

                        .join(
                           ", "
                        ),

               });

            }

         );

         sheet.getRow(
            1
         ).font = {

            bold:
               true,

         };

         res.setHeader(

            "Content-Type",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

         );

         res.setHeader(

            "Content-Disposition",

            `attachment; filename=tournament-teams.xlsx`

         );

         await workbook.xlsx.write(
            res
         );

         res.end();

      }

   );

const exportTournamentGroups =
   asyncHandler(

      async (
         req,
         res
      ) => {

         const {
            id
         } =
            req.params;

         const groups =

            await Group.find({

               tournament:
                  id,

            })

               .populate(
                  "round",
                  "name"
               )

               .populate(
                  {
                     path:
                        "teams",

                     select:
                        `
teamName
status
isEliminated
`
                  }

               )

               .sort({

                  createdAt:
                     1,

               });

         const workbook =
            new ExcelJS.Workbook();

         const sheet =

            workbook.addWorksheet(
               "Groups"
            );

         sheet.columns = [

            {
               header:
                  "Round",
               key:
                  "round",
               width:
                  24,
            },

            {
               header:
                  "Group",
               key:
                  "group",
               width:
                  18,
            },

            {
               header:
                  "Total Teams",
               key:
                  "totalTeams",
               width:
                  14,
            },

            {
               header:
                  "Playing",
               key:
                  "playing",
               width:
                  12,
            },

            {
               header:
                  "Eliminated",
               key:
                  "eliminated",
               width:
                  14,
            },

            {
               header:
                  "Qualification Locked",
               key:
                  "locked",
               width:
                  18,
            },

            {
               header:
                  "Teams",
               key:
                  "teams",
               width:
                  120,
            },

         ];

         groups.forEach(

            group => {

               const teams =

                  group.teams

                  ||

                  [];

               const eliminated =

                  teams.filter(

                     t =>

                        t?.isEliminated

                  ).length;

               const playing =

                  teams.length
                  -
                  eliminated;

               sheet.addRow({

                  round:

                     group.round
                        ?.name

                     ||

                     "-",

                  group:

                     group.name

                     ||

                     "-",

                  totalTeams:

                     teams.length,

                  playing,

                  eliminated,

                  locked:

                     group.qualificationLocked

                        ?

                        "Yes"

                        :

                        "No",

                  teams:

                     teams.length

                        ?

                        teams

                           .map(

                              t =>

                                 `${t.teamName

                                 }

[${t.isEliminated

                                    ?

                                    "OUT"

                                    :

                                    "LIVE"

                                 }]`

                           )

                           .join(
                              ", "
                           )

                        :

                        "-",

               });

            }

         );

         sheet.getRow(
            1
         ).font = {

            bold:
               true,

         };

         res.setHeader(

            "Content-Type",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

         );

         res.setHeader(

            "Content-Disposition",

            `attachment; filename=tournament-groups.xlsx`

         );

         await workbook.xlsx.write(
            res
         );

         res.end();

      }

   );

const exportTournamentMatches =
   asyncHandler(

      async (
         req,
         res
      ) => {

         const {
            id
         } =
            req.params;

         const matches =

            await Match.find({

               tournament:
                  id,

            })

               .populate(
                  "round",
                  "name"
               )

               .populate(
                  "group",
                  "name"
               )

               .populate(
                  {
                     path:
                        "teams",
                     select:
                        `
teamName
isEliminated
`,
                  }

               )

               .populate(
                  {
                     path:
                        "results.team",
                     select:
                        `
teamName
isEliminated
`,
                  }

               )

               .sort({

                  round:
                     1,

                  group:
                     1,

                  matchNumber:
                     1,

               });

         const workbook =
            new ExcelJS.Workbook();



         /* ---------- SHEET 1 ---------- */

         const overview =

            workbook.addWorksheet(
               "Match Overview"
            );

         overview.columns = [

            {
               header:
                  "Round",
               key:
                  "round",
               width:
                  18,
            },

            {
               header:
                  "Group",
               key:
                  "group",
               width:
                  16,
            },

            {
               header:
                  "Match No",
               key:
                  "match",
               width:
                  12,
            },

            {
               header:
                  "Match Name",
               key:
                  "name",
               width:
                  22,
            },

            {
               header:
                  "Map",
               key:
                  "map",
               width:
                  14,
            },

            {
               header:
                  "Status",
               key:
                  "status",
               width:
                  16,
            },

            {
               header:
                  "Date",
               key:
                  "date",
               width:
                  18,
            },

            {
               header:
                  "Start Time",
               key:
                  "time",
               width:
                  18,
            },

            {
               header:
                  "Room ID",
               key:
                  "room",

               width:
                  18,
            },

            {
               header:
                  "Password",
               key:
                  "pass",

               width:
                  18,
            },

            {
               header:
                  "Teams",
               key:
                  "teams",

               width:
                  10,
            },

            {
               header:
                  "Winner",
               key:
                  "winner",

               width:
                  25,
            },

            {
               header:
                  "Top 3",

               key:
                  "top",

               width:
                  60,
            },

         ];



         /* ---------- SHEET 2 ---------- */

         const results =

            workbook.addWorksheet(
               "Detailed Results"
            );

         results.columns = [

            {
               header:
                  "Round",
               key:
                  "round",
               width:
                  18,
            },

            {
               header:
                  "Group",
               key:
                  "group",
               width:
                  16,
            },

            {
               header:
                  "Match",
               key:
                  "match",
               width:
                  12,
            },

            {
               header:
                  "Rank",
               key:
                  "rank",
               width:
                  10,
            },

            {
               header:
                  "Team",
               key:
                  "team",
               width:
                  28,
            },

            {
               header:
                  "Kills",
               key:
                  "kills",
               width:
                  10,
            },

            {
               header:
                  "Placement",
               key:
                  "placement",
               width:
                  14,
            },

            {
               header:
                  "Total",
               key:
                  "total",
               width:
                  12,
            },

            {
               header:
                  "Eliminated",
               key:
                  "eliminated",
               width:
                  12,
            },

         ];



         /* ---------- SHEET 3 ---------- */

         const participants =

            workbook.addWorksheet(
               "Participation"
            );

         participants.columns = [

            {
               header:
                  "Round",
               key:
                  "round",
               width:
                  18,
            },

            {
               header:
                  "Group",
               key:
                  "group",
               width:
                  16,
            },

            {
               header:
                  "Match",
               key:
                  "match",
               width:
                  12,
            },

            {
               header:
                  "Teams",

               key:
                  "teams",

               width:
                  120,
            },

         ];



         /* ---------- SHEET 4 ---------- */

         const summary =

            workbook.addWorksheet(
               "Summary"
            );

         summary.columns = [

            {
               header:
                  "Metric",
               key:
                  "metric",
               width:
                  25,
            },

            {
               header:
                  "Value",
               key:
                  "value",
               width:
                  18,
            },

         ];



         matches.forEach(

            match => {

               const rows =

                  [
                     ...(match.results || [])
                  ]

                     .sort(

                        (
                           a,
                           b
                        ) =>

                           (
                              b.totalPoints
                              ||
                              0
                           )

                           -

                           (
                              a.totalPoints
                              ||
                              0
                           )

                     );

               overview.addRow({

                  round:

                     match.round
                        ?.name

                     ||

                     "-",

                  group:

                     match.group
                        ?.name

                     ||

                     "-",

                  match:

                     match.matchNumber,

                  name:

                     match.name,

                  map:

                     match.map,

                  status:

                     match.status,

                  date:

                     match.scheduledAt

                        ?

                        new Date(
                           match.scheduledAt
                        )

                           .toLocaleDateString()

                        :

                        "-",

                  time:

                     match.startTime

                        ?

                        new Date(
                           match.startTime
                        )

                           .toLocaleTimeString()

                        :

                        "-",

                  room:

                     match.roomId

                     ||

                     "-",

                  pass:

                     match.roomPassword

                     ||

                     "-",

                  teams:

                     match.teams
                        ?.length

                     ||

                     0,

                  winner:

                     rows[0]
                        ?.team
                        ?.teamName

                     ||

                     "-",

                  top:

                     rows

                        .slice(
                           0,
                           3
                        )

                        .map(

                           r =>

                              r.team
                                 ?.teamName

                        )

                        .join(
                           " | "
                        ),

               });

               participants.addRow({

                  round:

                     match.round
                        ?.name,

                  group:

                     match.group
                        ?.name,

                  match:

                     match.matchNumber,

                  teams:

                     match.teams

                        .map(

                           t =>

                              `${t.teamName}

(${t.isEliminated

                                 ?

                                 "OUT"

                                 :

                                 "LIVE"

                              })`

                        )

                        .join(
                           ", "
                        ),

               });

               rows.forEach(

                  (
                     r,
                     i
                  ) => {

                     results.addRow({

                        round:

                           match.round
                              ?.name,

                        group:

                           match.group
                              ?.name,

                        match:

                           match.matchNumber,

                        rank:

                           i + 1,

                        team:

                           r.team
                              ?.teamName,

                        kills:

                           r.kills,

                        placement:

                           r.placementPoints,

                        total:

                           r.totalPoints,

                        eliminated:

                           r.team
                              ?.isEliminated

                              ?

                              "Yes"

                              :

                              "No",

                     });

                  }

               );

            }

         );



         summary.addRow({

            metric:
               "Total Matches",

            value:

               matches.length,

         });

         summary.addRow({

            metric:
               "Completed",

            value:

               matches.filter(

                  m =>

                     m.status ===
                     "completed"

               ).length,

         });

         summary.addRow({

            metric:
               "Live",

            value:

               matches.filter(

                  m =>

                     m.status ===
                     "live"

               ).length,

         });

         summary.addRow({

            metric:
               "Upcoming",

            value:

               matches.filter(

                  m =>

                     m.status ===
                     "upcoming"

               ).length,

         });



         [
            overview,
            results,
            participants,
            summary
         ]

            .forEach(

               sheet => {

                  sheet.getRow(
                     1
                  ).font = {

                     bold:
                        true,

                  };

               }

            );

         res.setHeader(

            "Content-Type",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

         );

         res.setHeader(

            "Content-Disposition",

            `attachment; filename=tournament-matches.xlsx`

         );

         await workbook.xlsx.write(
            res);

         res.end();

      }

   );


export {
   createTournament,
   getAllTournaments,
   getTournamentById,
   deleteTournament,
   updateTournament,
   getTournamentTeamsData,
   exportTournamentTeams,
   exportTournamentGroups,
   exportTournamentMatches,
};