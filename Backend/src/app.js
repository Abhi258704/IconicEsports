import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import tournamentRoutes from "./routes/tournament.route.js";
import teamRoutes from "./routes/team.route.js";
import roundRoutes from "./routes/round.route.js";
import groupRoutes from "./routes/group.route.js";
import matchRoutes from "./routes/match.route.js";


const app = express()

app.use(cors({
   origin: "http://localhost:3000",
   credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())




// auth
app.use("/api/v1/auth", authRoutes);

//routes
app.use("/api/v1/users", userRoutes);

app.use("/api/v1/tournaments",tournamentRoutes);

app.use("/api/v1/teams",teamRoutes);

app.use("/api/v1/rounds",roundRoutes);

app.use("/api/v1/groups",groupRoutes);

app.use("/api/v1/matches",matchRoutes);







// Global Error Middleware

app.use((err, req, res, next) => {
   res.status(err.statusCode || 500).json({
      success: false,
      message: err.message
   })
})

app.get("/test", (req, res) => {
   res.send("Server working")
})



export { app }