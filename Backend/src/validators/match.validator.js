import { z } from "zod";

const resultSchema = z.object({

   team:
      z.string()
         .min(1, "Team required"),

   kills:
      z.coerce.number()
         .min(0, "Kills cannot be negative"),

   placementPoints:
      z.coerce.number()
         .min(0, "Placement points cannot be negative"),

});

const updateMatchResultsSchema =
   z.object({

      results:
         z.array(resultSchema)
            .min(1, "Results required"),

   });

export {
   updateMatchResultsSchema,
};