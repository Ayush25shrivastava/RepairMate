import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const adminSchema = new mongoose.Schema({
    adminId: { type: String, required: true, unique: true },
    password:{type:String,required:true},
    phone:{type:Number,required:true},
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },


    isGlobalAdmin: { type: Boolean, default: false }
});
export const Admin = mongoose.model('Admin', adminSchema);