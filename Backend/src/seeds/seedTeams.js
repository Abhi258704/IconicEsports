import mongoose from "mongoose";

import dotenv from "dotenv";

import { faker }
from "@faker-js/faker";

import Team
from "../models/team.model.js";

import Tournament
from "../models/tournament.model.js";

import { DB_NAME } from "../constants.js";


dotenv.config();

await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

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
         (_, i) => ({

            ign:
               faker.internet.username(),

            uid:
               faker.string.numeric(10),

            phone:
               faker.string.numeric(10),

         })
      );

   };

const seedTeams =
   async () => {

      try {

         console.log(
            "Seeding started..."
         );

         /* GET TOURNAMENT */

         const tournament =
            await Tournament.findOne();

         if (!tournament) {

            console.log(
               "No tournament found"
            );

            process.exit();

         }

         /* DELETE OLD */

         await Team.deleteMany({
            tournament:
               tournament._id,
         });

         const teams = [];

         for (
            let i = 0;
            i < 64;
            i++
         ) {

            teams.push({

               teamName:
                  generateTeamName() +
                  " " +
                  i,

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

         }

         await Team.insertMany(
            teams
         );

         console.log(
            "200 pending teams created"
         );

         process.exit();

      } catch (error) {

         console.log(error);

         process.exit(1);

      }

   };

seedTeams();