import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        enum: ['ELECTRICAL', 'PLUMBING', 'HVAC', 'CARPENTRY', 'OTHER']
    },
    description: {
        type: String,
        required: true
    },
    
}, { timestamps: true });

export const Department = mongoose.model("Department", departmentSchema);
