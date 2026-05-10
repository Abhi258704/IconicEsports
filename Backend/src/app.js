import express from "express";

const app = express()

app.get("/test", (req, res) => {
   res.send("Server working")
})



export { app }