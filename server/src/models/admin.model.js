import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const adminSchema = new mongoose.Schema({
    adminId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isGlobalAdmin: { type: Boolean, default: false },
    refreshtoken: { type: String }
}, { timestamps: true });

adminSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const rounds = 5;
    this.password = await bcrypt.hash(this.password, rounds);
})

adminSchema.methods.comparePassword = function comparePassword(candidate) {
    return bcrypt.compare(candidate, this.password);
};

adminSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this.id,
        email: this.email,
        adminId: this.adminId,
        role: "admin"
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        },
    )
}

adminSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this.id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        },
    )
}

export const Admin = mongoose.model('Admin', adminSchema);