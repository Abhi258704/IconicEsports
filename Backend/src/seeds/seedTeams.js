// import mongoose from "mongoose";

// import dotenv from "dotenv";

// import { faker }
// from "@faker-js/faker";

// import Team
// from "../models/team.model.js";

// import Tournament
// from "../models/tournament.model.js";

// import Group
// from "../models/group.model.js";

// import Round
// from "../models/round.model.js";

// import { DB_NAME }
// from "../constants.js";

// dotenv.config();

// await mongoose.connect(
//    `${process.env.MONGODB_URL}/${DB_NAME}`
// );

// const TEAM_PREFIXES = [
//    "Team",
//    "Soul",
//    "God",
//    "Blind",
//    "Shadow",
//    "Alpha",
//    "Hydra",
//    "Inferno",
//    "Revenant",
//    "Phoenix",
// ];

// const TEAM_SUFFIXES = [
//    "Hunters",
//    "Warriors",
//    "Titans",
//    "Esports",
//    "Squad",
//    "Legends",
//    "Wolves",
//    "Empire",
//    "Killers",
//    "Kings",
// ];

// const generateTeamName =
//    () => {

//       const prefix =
//          TEAM_PREFIXES[
//             Math.floor(
//                Math.random() *
//                TEAM_PREFIXES.length
//             )
//          ];

//       const suffix =
//          TEAM_SUFFIXES[
//             Math.floor(
//                Math.random() *
//                TEAM_SUFFIXES.length
//             )
//          ];

//       return `${prefix} ${suffix}`;

//    };

// const generatePlayers =
//    () => {

//       return Array.from(
//          { length: 4 },
//          () => ({

//             ign:
//                faker.internet.username(),

//             uid:
//                faker.string.numeric(10),

//             phone:
//                faker.string.numeric(10),

//          })
//       );

//    };

// const seedTeams =
//    async () => {

//       try {

//          console.log(
//             "Seeding started..."
//          );

//          /* GET TOURNAMENT */

//          const tournament =
//             await Tournament.findOne();

//          if (!tournament) {

//             console.log(
//                "No tournament found"
//             );

//             process.exit();

//          }

//          /* RESET TOURNAMENT STATE */

//          await Team.deleteMany({

//             tournament:
//                tournament._id,

//          });

//          await Group.deleteMany({

//             tournament:
//                tournament._id,

//          });

//          await Round.updateMany(

//             {

//                tournament:
//                   tournament._id,

//             },

//             {

//                $set: {

//                   groups: [],

//                },

//             }

//          );

//          /* CREATE PENDING TEAMS */

//          const teams = [];

//          for (
//             let i = 0;
//             i < 64;
//             i++
//          ) {

//             teams.push({

//                teamName:
//                   generateTeamName() +
//                   " " +
//                   i,

//                leaderName:
//                   faker.person.fullName(),

//                leaderPhone:
//                   faker.string.numeric(10),

//                players:
//                   generatePlayers(),

//                tournament:
//                   tournament._id,

//                status:
//                   "pending",

//             });

//          }

//          await Team.insertMany(
//             teams
//          );

//          console.log(
//             `${teams.length} pending teams created`
//          );

//          process.exit();

//       } catch (error) {

//          console.log(error);

//          process.exit(1);

//       }

//    };

// seedTeams();

import mongoose from "mongoose";

import dotenv from "dotenv";

import { faker }
from "@faker-js/faker";

import Team
from "../models/team.model.js";

import Tournament
from "../models/tournament.model.js";

import { DB_NAME }
from "../constants.js";

dotenv.config();

await mongoose.connect(
   `${process.env.MONGODB_URL}/${DB_NAME}`
);

const TEAM_PREFIXES = [
   "Team",
   "Soul",
   "God",
   "Blind",
   "Shadow",
   "Alpha",
   "Hydra",
   "Inferno",
   "Revenant",
   "Phoenix",
];

const TEAM_SUFFIXES = [
   "Hunters",
   "Warriors",
   "Titans",
   "Esports",
   "Squad",
   "Legends",
   "Wolves",
   "Empire",
   "Killers",
   "Kings",
];

const generateTeamName =
   () => {

      const prefix =
         TEAM_PREFIXES[
            Math.floor(
               Math.random() *
               TEAM_PREFIXES.length
            )
         ];

      const suffix =
         TEAM_SUFFIXES[
            Math.floor(
               Math.random() *
               TEAM_SUFFIXES.length
            )
         ];

      return `${prefix} ${suffix}`;

   };

const generatePlayers =
   () => {

      return Array.from(
         { length: 4 },
         () => ({

            ign:
               faker.internet.username(),

            uid:
               faker.string.numeric(10),

            phone:
               faker.string.numeric(10),

         })
      );

   };

const seedLateTeam =
   async () => {

      try {

         console.log(
            "Creating late registration team..."
         );

         /* GET TOURNAMENT */

         const tournament =
            await Tournament.findOne();

         if (!tournament) {

            console.log(
               "No tournament found"
            );

            process.exit(1);

         }

         /* CREATE SINGLE PENDING TEAM */

         const team =
            await Team.create({

               teamName:
                  generateTeamName() +
                  " " +
                  faker.number.int({
                     min: 100,
                     max: 999,
                  }),

               leaderName:
                  faker.person.fullName(),

               leaderPhone:
                  faker.string.numeric(10),

               players:
                  generatePlayers(),

               tournament:
                  tournament._id,

               status:
                  "pending",

            });

         console.log(
            `Late team created: ${team.teamName}`
         );

         process.exit();

      } catch (error) {

         console.log(error);

         process.exit(1);

      }

   };

seedLateTeam();