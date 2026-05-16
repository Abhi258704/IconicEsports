import { ApiError } from "../utils/ApiError.js";

const validate = (schema) => {

   return (req, res, next) => {

      try {

         req.body = schema.parse(req.body);

         next();

      } catch (error) {

         const firstError =
            error.errors?.[0];

         return next(

            new ApiError(
               400,
               firstError?.message ||
               "Validation failed"
            )

         );

      }

   };

};

export { validate };