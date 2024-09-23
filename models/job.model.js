import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    requirement: [{
        type: String
    }],
    salary: {
        type: Number,
        required: true
    },
    experienceLevel: {
        type: Number,
        require:true
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    createtd_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    application: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ]

}, { timestamps: true })

export const Job = mongoose.model("Job", jobSchema);