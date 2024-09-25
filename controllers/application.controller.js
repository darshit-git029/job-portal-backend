import { Application } from "../models/application.model.js"
import { Job } from "../models/job.model.js"


export const applyJob = async (req, res) => {
    try {
        const userID = req.id
        const JobID = req.params.id

        if (!JobID) {
            return res.status(400).json({
                message: "job id is require"
            })
        }
        //check if user already apply for the job
        const existingapplication = await Application.findOne({ job: JobID, applicant: userID })
        if (existingapplication) {
            return res.status(400).json({
                message: "you have already apply for this jod"
            })
        }

        //check job is avilable to apply
        const job = await Job.findById(JobID)
        if (!job) {
            return res.status(404).json({
                message: "job is not found."
            })
        }

        //create new application
        const newApplication = await Application.create({
            job: JobID,
            applicant: userID
        })

        //all application of job applied push in application array
        job.application.push(newApplication._id)
        await job.save()

        return res.status(201).json({
            message: "job applied successfully",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"internal server error, Please try again later",
            success: false
        });
    }
}

export const getAppliedJob = async (req, res) => {
    try {
        const userID = req.id
        const application = await Application.find({ applicant: userID }).sort({ createdAt: -1 }).populate({
            path: "job",
            options: { sort: { createdAt: -1 } },
            populate: ({
                path: "company",
                options: { sort: { createdAt: -1 } },
            })
        })

        if (!application) {
            return res.status(404).json({
                success:false,
                message: "No application yet.",
            })
        }

        return res.status(200).json({  
            message:"Applied jobs",          
            success: true,
            application,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"internal server error, Please try again later",
            success: false
        });
    }
}

export const getApplicant = async (req, res) => {
    try {
        const JobID = req.params.id
        const job = await Job.findById( JobID ).populate({
            path: "application",
            options: { sort: { createdAt: -1 } },
            populate: ({
                path: "applicant",
                options: { sort: { createdAt: -1 } }
            })
        })
        if (!job) {
            return res.status(404).json({
                message: "job not found."
            })
        }

        return res.status(200).json({
            job,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"internal server error, Please try again later",
            success: false
        });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body
        const applicationID = req.params.id

        if (!status) {
            return res.status(404).json({
                message: "status is required."
            })
        }

        //finde application using application id 
        const application = await Application.findOne({ _id: applicationID })
        if (!application) {
            return res.status(404).json({
                message: "application is not found."
            })
        }

        //update the status
        application.status = status.toLowerCase()
        await application.save()

        return res.status(200).json({
            success:true,
            message:"Status Update successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"internal server error, Please try again later",
            success: false
        });
    }
}