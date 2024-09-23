import { Company } from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/Datauir.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;

        // Check if companyName is provided
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        // Check if the company already exists
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register the same company.",
                success: false
            });
        }

        // Create a new company
        company = await Company.create({
            name: companyName,
            userID: req.id
        });

        // Respond with success
        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while registering the company.",
            success: false
        });
    }
};


export const getcompany = async (req, res) => {
    try {
        const userID = req.id;
        const companies = await Company.find({userID})
        if (!companies)
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            });
            return res.status(200).json({
                companies,
                success: true
            });
    } catch (error) {
        console.log(error);
        
    }
}

export const getCompanyById = async (req, res) => {
    try {
        const companyID = req.params.id;
        const company = await Company.findById(companyID )
        if (!company) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            });
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}

export const updateCompnay = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        //cloudeinary
        const file = req.file;
        const fileUir  = getDataUri(file)
        const cloudeResponse = await cloudinary.uploader.upload(fileUir.content)
        const logo = cloudeResponse.secure_url

        const updateData = { name, description, website, location , logo}

         
        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true })

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }
        return res.status(200).json({
            message: "Company information updated.",
            success: true
            
        })
    } catch (error) {
        console.log(error);
        
    }
}