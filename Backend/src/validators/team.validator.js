import { z } from "zod";

const registerTeamSchema = z.object({

   teamName:
      z.string()
         .min(3, "Team name must be at least 3 characters"),

   leaderName:
      z.string()
         .min(2, "Leader name is required"),

   leaderPhone:
      z.string()
         .min(10, "Invalid phone number"),

   tournamentId:
      z.string()
         .min(1, "Tournament ID required"),

   players:
      z.array(
         z.string()
      ).min(
         3,
         "At least three player required"
      ),

});

export {
   registerTeamSchema,
};