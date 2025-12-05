import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const EngineerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user", "engineer"] },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    oncallstatus: { type: String },
    loadfactor: { type: String },
    ratings: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
    },
    avatarUrl: { type: String }
})

EngineerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const rounds = 5;
    this.password = await bcrypt.hash(this.password, rounds);
    next();
})

EngineerSchema.methods.comparePassword = function comparePassword(candidate) {
    return bcrypt.compare(candidate, this.password);
};

EngineerSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this.id,
        username: this.UserName,
        email: this.email
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        },
    )
}

EngineerSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this.id,

    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        },
    )

}

const Engineer = mongoose.model('Engineer', EngineerSchema);
export default Engineer;

