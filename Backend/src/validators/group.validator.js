import { z } from "zod";

const moveTeamsToNextRoundSchema =
   z.object({

      nextRoundId:
         z.string()
            .min(1, "Next round required"),

      selectedTeamIds:
         z.array(
            z.string()
         ).min(
            1,
            "Select at least one team"
         ),

   });

const moveTeamsSchema =
   z.object({

      teamIds:
         z.array(
            z.string()
         ).min(
            1,
            "Teams required"
         ),

      fromGroupId:
         z.string()
            .min(1),

      toGroupId:
         z.string()
            .min(1),

   });

export {
   moveTeamsToNextRoundSchema,
   moveTeamsSchema,
};