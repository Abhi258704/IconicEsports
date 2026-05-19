import {
   z,
} from "zod";

const playerSchema =
   z.object({

      ign:
         z
            .string()
            .trim()
            .min(
               1,
               "IGN is required"
            ),

      uid:
         z
            .string()
            .trim()
            .min(
               1,
               "UID is required"
            ),

      phone:
         z
            .string()
            .trim()
            .regex(
               /^\d{10}$/,
               "Phone must be 10 digits"
            ),

   });

const registerTeamSchema =
   z.object({

      teamName:
         z
            .string()
            .trim()
            .min(
               3,
               "Team name must be at least 3 characters"
            ),

      leaderName:
         z
            .string()
            .trim()
            .min(
               2,
               "Leader name is required"
            ),

      leaderPhone:
         z
            .string()
            .trim()
            .regex(
               /^\d{10}$/,
               "Leader phone must be 10 digits"
            ),

      tournamentId:
         z
            .string()
            .min(
               1,
               "Tournament ID required"
            ),

      players:

         z

            .array(
               playerSchema
            )

            .min(
               4,
               "Minimum 4 players required"
            )

            .max(
               5,
               "Maximum 5 players allowed"
            ),

   })

   .superRefine(

      (
         data,
         ctx
      ) => {

         data.players.forEach(

            (
               player,
               index
            ) => {

               const isOptionalPlayer =

                  index === 4;

               const empty =

                  !player.ign &&
                  !player.uid &&
                  !player.phone;

               if (

                  isOptionalPlayer &&
                  empty

               ) {

                  return;

               }

               if (

                  !player.ign ||

                  !player.uid ||

                  !player.phone

               ) {

                  ctx.addIssue({

                     code:
                        "custom",

                     path:
                        [

                           "players",

                           index,

                        ],

                     message:
                        `Player ${
                           index + 1
                        } incomplete`,

                  });

               }

            }

         );

      }

   );

export {

   registerTeamSchema,

};