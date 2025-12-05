import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./DB/index.js";
import dotenv from "dotenv"
import { app } from "./app.js";


dotenv.config({
    path:"./.env",
    quiet:true
});
connectDB()
.then(()=>{
    app.listen(process.env.PORT||7000,()=>{
        console.log(`server is running at port: ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGO_connection failed",err);
})