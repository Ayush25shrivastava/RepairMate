import mongoose from "mongoose";
const IssueSchema=new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:string,required:true},
    location: {
    name: { type: String, required: false }, 
    attachment:{type:string,type:required},
    priority: { type: String },
    type: { type: String },
    status: { type: String  },
    },
    slaTargetResolutionDate: { type: Date, default: null }, 
    slaStatus: { 
    type: String, 
    enum: ['IN_COMPLIANCE', 'WARNING', 'BREACHED', 'EXEMPT'], 
    default: 'EXEMPT' 
    },
    timeRemainingMinutes: { type: Number, default: null },

    Engineer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Engineer', 
    required: true 
    },
    
})
const Issue=IssueSchema.model('Issue',IssueSchema);
export default Issue;
