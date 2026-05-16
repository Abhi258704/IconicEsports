import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import tournamentRoutes from "./routes/tournament.route.js";
import teamRoutes from "./routes/team.route.js";
import roundRoutes from "./routes/round.route.js";
import groupRoutes from "./routes/group.route.js";
import matchRoutes from "./routes/match.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";

import { errorHandler }
   from "./middlewares/error.middleware.js";

const app = express();



/* SECURITY */

app.use(helmet());

app.use(hpp());

app.use(mongoSanitize());




/* RATE LIMIT */

const limiter = rateLimit({

   windowMs:
      15 * 60 * 1000,

   max: 300,

   message: {
      success: false,
      message:
         "Too many requests, please try again later",
   },

});

app.use(limiter);




/* CORS */

app.use(cors({
   origin: "http://localhost:3000",
   credentials: true
}));





/* BODY PARSERS */

app.use(express.json({
   limit: "16kb"
}));

app.use(express.urlencoded({
   extended: true,
   limit: "16kb"
}));

app.use(express.static("public"));

app.use(cookieParser());




// auth limiter
const authLimiter = rateLimit({

   windowMs:
      15 * 60 * 1000,

   max: 20,

   message: {
      success: false,
      message:
         "Too many login attempts",
   },

});

app.use(
   "/api/v1/auth",
   authLimiter,
   authRoutes
);




/* ROUTES */

// auth

// users
app.use("/api/v1/users", userRoutes);

// tournaments
app.use("/api/v1/tournaments", tournamentRoutes);

// teams
app.use("/api/v1/teams", teamRoutes);

// rounds
app.use("/api/v1/rounds", roundRoutes);

// groups
app.use("/api/v1/groups", groupRoutes);

// matches
app.use("/api/v1/matches", matchRoutes);

// dashboard
app.use("/api/v1/dashboard", dashboardRoutes);




/* TEST */

app.get("/test", (req, res) => {
   res.send("Server working");
});




/* ERROR HANDLER */

app.use(errorHandler);

export { app };