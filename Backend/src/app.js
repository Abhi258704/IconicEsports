import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.route.js";


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