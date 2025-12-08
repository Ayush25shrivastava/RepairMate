import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import { ApiResponse } from "./utility/ApiResponse.js"
import engineerRoutes from "./routes/engineer.routes.js"
import userRoutes from "./routes/user.routes.js"
import issueRoutes from "./routes/issue.routes.js"
import adminRoutes from "./routes/admin.routes.js"

const app = express()
dotenv.config()

// Relaxed CORS for development
app.use(cors({
    origin: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}))

// Request Logger
app.use((req, res, next) => {
    console.log(`[REQ] ${req.method} ${req.url}`);
    next();
});

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