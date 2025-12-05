import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
        name: { type: String, required: false },
    },
    attachment: { type: String },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
        default: 'MEDIUM'
    },
    type: {
        type: String,
        enum: ['ELECTRICAL', 'PLUMBING', 'HVAC', 'CARPENTRY', 'OTHER'],
        default: 'OTHER'
    },
    status: {
        type: String,
        enum: ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
        default: 'PENDING'
    },
    slaTargetResolutionDate: { type: Date, default: null },
    slaStatus: {
        type: String,
        enum: ['IN_COMPLIANCE', 'WARNING', 'BREACHED', 'EXEMPT'],
        default: 'EXEMPT'
    },
    timeRemainingMinutes: { type: Number, default: null },


    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    Engineer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Engineer',
        required: false // Changed to false because a new complaint won't have an engineer yet
    },

}, { timestamps: true })

const Issue = mongoose.model('Issue', IssueSchema);
export default Issue;
