import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
const UserSchema=new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,trim:true,unique:true,lowercase:true},
    phone:{type:Number,required:true},
    password:{type:String,required:true},
    role:{type:String,enum:["admin","user","engineer"]},
    departmentId:{type:mongoose.Schema.Types.ObjectId, ref:"department"},
    ratings: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
    },
    avatarUrl:{type:String}

})
UserSchema.pre('save',async function hash(password) {
    if(!this.isModified(password))return next();
    const rounds=5;
    this.password=await bcrypt.hash(this.password,rounds);
    next();
})
UserSchema.methods.comparePassword = function comparePassword(candidate) {
    return bcrypt.compare(candidate, this.password);
};
const User=mongoose.model('User',UserSchema);
export default User;

