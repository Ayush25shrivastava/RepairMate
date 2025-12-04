import mongoose from "mongoose";
import bcrypt from 'bcrypt';

EngineerSchema=new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,trim:true,unique:true,lowercase:true},
    phone:{type:Number,required:true},
    password:{type:String,required:true},
    role:{type:String,enum:["admin","user","engineer"]},
    departmentId:{type:mongoose.Schema.Types.ObjectId, ref:"department"},
    status:{type:{type:string}},
    loadfactor:{type:string},
    ratings: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
    },
    avatarUrl:{type:String}
})
EngineerSchema.pre('save',async function hash(password) {
    if(!this.isModified(password))return next();
    const rounds=5;
    this.password=await bcrypt.hash(this.password,rounds);
    next();
})
EngineerSchema.methods.comparePassword = function comparePassword(candidate) {
    return bcrypt.compare(candidate, this.password);
};
const Engineer=EngineerSchema.model('User',EngineerSchema);
export default Engineer;
