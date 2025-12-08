import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { MongoMemoryServer } from "mongodb-memory-server"; // Ensure this matches package.json

const connectDB = async () => {
    try {
        // 1. Try connecting to the provided Local/Cloud URL first
        // We set a short timeout so we don't wait forever if it's not running
        const connString = `${process.env.MONGO_URL}/${DB_NAME}`;
        console.log(`\nAttempting local connection: ${connString}`);
        
        const connectionInstance = await mongoose.connect(connString, {
            serverSelectionTimeoutMS: 5000, // 5s timeout
        });
        
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        // 2. Fallback to In-Memory Database
        console.log("\n❌ Local MongoDB not found (ECONNREFUSED).");
        console.log("🚀 Starting In-Memory MongoDB (Fallback Mode)...");

        try {
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            
            console.log(`\nIn-Memory Instance Ready: ${uri}`);
            const connectionInstance = await mongoose.connect(uri, {
                dbName: DB_NAME
            });
            
            console.log(`\n✅ MongoDB Connected (In-Memory) !! DB HOST: ${connectionInstance.connection.host}`);
            console.log("⚠️  NOTE: Data will reset when the server restarts.");
            
        } catch (memError) {
            console.log("MONGODB connection FATAL ERROR: ", memError);
            process.exit(1);
        }
    }
};

export default connectDB;
