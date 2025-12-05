import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user", "engineer"] },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    ratings: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
    },
    avatarUrl: { type: String },
    refreshtoken: { type: String }
})

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const rounds = 5;
    this.password = await bcrypt.hash(this.password, rounds);
})

UserSchema.methods.comparePassword = function comparePassword(candidate) {
    return bcrypt.compare(candidate, this.password);
};

UserSchema.methods.generateAccessToken = function () {
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

UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this.id,

    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        },
    )

}

const User = mongoose.model('User', UserSchema);
export default User;

