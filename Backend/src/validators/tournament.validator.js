import { z } from "zod";

const tournamentSchema = z.object({

   name:
      z.string()
         .min(3, "Tournament name required"),

   game:
      z.string()
         .min(2, "Game name required"),

   prizePool:
      z.coerce.number()
         .min(0, "Prize pool invalid"),

   entryFee:
      z.coerce.number()
         .min(0, "Entry fee invalid"),

   maxTeams:
      z.coerce.number()
         .min(1, "Max teams required"),

   teamSize:
      z.coerce.number()
         .min(1, "Team size required"),

   teamsPerGroup:
      z.coerce.number()
         .min(1, "Teams per group required"),

   maps:
      z.string(),

   rules:
      z.string()
         .optional(),

   startDate:
      z.string()
         .min(1, "Start date required"),

});

export {
   tournamentSchema,
};