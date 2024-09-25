import { Job } from "../models/job.model.js"

export const postJob = async (req, res) => {
    try {
        const { title, description, requirement, salary, location, jobType, experience, position, companyID } = req.body

        const userID = req.id

        if (!title || !description || !requirement || !salary || !location || !jobType || !experience || !position || !companyID) {
            return res.status(400).json({
                message: "Sonthing is missing."
            })
        }
        const job = await Job.create({
            title,
            description,
            requirement: requirement.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyID,
            createtd_by: userID,

        })
        return res.status(201).json({
            job,
            message: "New job created successfully.",
            success: true
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message:"Something went wrong",
            success:false
        })
    }
}

export const getAllJob = async (req, res) => {
    try {
        const keyWord = req.query.keyWord || "";

        const query = {
            $or: [
                { title: { $regex: keyWord, $options: "i" } },
                { description: { $regex: keyWord, $options: "i" } },
            ]
        };

        const jobs = await Job.find(query).populate({ path: "company" }).sort({ createdAt: -1 });

        if (!jobs.length) {
            return res.status(200).json({
                success: true,
                message: "No jobs found matching your search query.",
                data: { jobs: [] },
            });
        }

        return res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            data: { jobs },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching jobs.",
        });
    }
};


export const getJobById = async (req, res) => {
    try {
        const JobID = req.params.id;
        const job = await Job.findById(JobID).populate({
            path: "application"
        })
        if (!job) {
            return res.status(400).json({
                message: "Jons not found."
            })
        }

        return res.status(200).json({
            job,
            success: "true"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching jobs by id .",
        });
    }
}

export const getJobAdmin = async (req, res) => {
    try {
        const AdminID = req.id

        const jobs = await Job.find({ createtd_by: AdminID }).populate({
            path: 'company',
            createtdAt: -1
        })

        if (!jobs) {
            return res.status(400).json({
                message: "Jobs not found."
            })
        }

        return res.status(200).json({
            jobs,
            success: "true"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching admin jobs.",
        });
    }
}