import mongoose from "mongoose";

import dotenv from "dotenv";

import Team from "../models/team.model.js";

import Round from "../models/round.model.js";

import Group from "../models/group.model.js";

import { DB_NAME } from "../constants.js";

dotenv.config();

await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
const TEAMS_PER_GROUP = 8;

const assignTeams =
   async () => {

      try {

         console.log(
            "Assigning teams..."
         );

         /* VERIFIED TEAMS */

         const teams =
            await Team.find({
               status: "verified",
            });

         if (!teams.length) {

            console.log(
               "No verified teams"
            );

            process.exit();

         }

         /* FIRST ROUND */

         const round =
            await Round.findOne()

            .sort({
               roundNumber: 1,
            });

         if (!round) {

            console.log(
               "No round found"
            );

            process.exit();

         }

         /* CLEAN OLD GROUPS */

         await Group.deleteMany({
            round: round._id,
         });

         round.groups = [];

         await round.save();

         let currentGroup = null;

         let currentCount = 0;

         let groupIndex = 0;

         for (const team of teams) {

            /* CREATE NEW GROUP */

            if (
               !currentGroup ||

               currentCount >=
               TEAMS_PER_GROUP
            ) {

               const groupName =
                  `Group ${
                     String.fromCharCode(
                        65 + groupIndex
                     )
                  }`;

               currentGroup =
                  await Group.create({

                     name:
                        groupName,

                     tournament:
                        team.tournament,

                     round:
                        round._id,

                     teams: [],
                  });

               round.groups.push(
                  currentGroup._id
               );

               await round.save();

               currentCount = 0;

               groupIndex++;

            }

            /* ASSIGN TEAM */

            currentGroup.teams.push(
               team._id
            );

            await currentGroup.save();

            team.group =
               currentGroup._id;

            await team.save();

            currentCount++;

         }

         console.log(
            "Teams assigned successfully"
         );

         process.exit();

      } catch (error) {

         console.log(error);

         process.exit(1);

      }

   };

assignTeams();
