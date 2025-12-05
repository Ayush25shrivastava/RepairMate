import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import { ApiResponse } from "./utility/ApiResponse.js"
import { ApiError } from "./utility/ApiError.js"

// Import routes
import engineerRoutes from "./routes/engineer.routes.js"
import userRoutes from "./routes/user.routes.js"
import issueRoutes from "./routes/issue.routes.js"
import adminRoutes from "./routes/admin.routes.js"

const app = express()
dotenv.config()
app.use(cors({
    origin: process.env.CORS_ORIGIN === "*" ? true : (process.env.CORS_ORIGIN || "http://localhost:5173"),
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


app.use("/api/v1/engineers", engineerRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/issues", issueRoutes)
app.use("/api/v1/admin", adminRoutes)


app.get("/api/v1/running", (req, res) => {
    res.status(200).json(new ApiResponse(200, {}, "Server is running"))
})



export { app }