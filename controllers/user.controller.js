import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/Datauir.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password, role } = req.body;
        console.log(fullName, email, phoneNumber, password, role);

        if (!fullName || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Some required fields are missing. Please ensure all fields are filled out correctly."

            })
        }

        const file = req.file
        const fileUir = getDataUri(file)
        const cloudeResponse = await cloudinary.uploader.upload(fileUir.content)

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                message: "user already exist with this email, please try another email"
            })
        }

        const hashpassword = await bcrypt.hash(password, 10)

        await User.create({
            fullName,
            email,
            password: hashpassword,
            phoneNumber,
            role,
            profile: {
                profilePhoto: cloudeResponse.secure_url
            }
        })


        return res.status(200).json({
            message: ` welcome to job portal, ${fullName} your Account create successfully.`,
            success: true
        })


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ // 500 Internal Server Error for unexpected issues
            message: "An internal server error occurred. Please try again later.",
            success: false
        });
    }

}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Somethings is missing"
            })
        }
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email, user not found."
            })
        }
        const ispasswoedMatch = await bcrypt.compare(password, user.password)
        if (!ispasswoedMatch) {
            return res.status(400).json({
                message: "Incorrect password. Please try again."
            })
        }
        //check rola correct or not 
        if (role != user.role) {
            return res.status(400).json({
                message: "Account does't exist with this role"
            })
        }
        const tokenData = {
            userID: user._id
        }

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, process.env.EXPIRE_KEY)

        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile

        }

        return res.status(200).json({
            message: `welcome back ${user.fullName}`,
            data: {
                user,
                token: token
            },
            success: true
        })
    }
    catch (error) {
        return res.status(500).json({
            message:"internal server error, Please try again later",
            success:false
        })

    }
}

export const logout = async (req, res) => {
    try {

        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: `Logged out successfully.`,
            success: true

        })
    } catch (error) {
        return res.status(500).json({
            message:"internal server error, Please try again later",
            success:false
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, bio, skills } = req.body;
        // console.log(fullName, email, phoneNumber,bio ,skills  );

        //cloudinary setup for file
        const file = req.file
        if (!file) {
            console.log("NO file upload");
            
            return null ;
        }
            const fileUir = getDataUri(file)
            const cloudeResponse = await cloudinary.uploader.upload(fileUir.content)

        let skillArray;
        if (skills) {
            skillArray = skills.split(","); // Use split to convert the comma-separated string into an array
        }

        const userID = req.id
        let user = await User.findById(userID)

        if (!user) {
            return res.status(400).json({
                message: "user not found"
            })
        }

        if (fullName) user.fullName = fullName
        if (email) user.email = email
        if (phoneNumber) user.phoneNumber = phoneNumber
        if (bio) user.profile.bio = bio
        if (skills) user.profile.skills = skillArray

        //resume comes here
        console.log(file);

        if (cloudeResponse) {
            user.profile.resume = cloudeResponse.secure_url;
            user.profile.resumeOriginalName = file.originalname;
        }


        await user.save();
        console.log(fullName, email, phoneNumber, bio, skills);



        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }


        return res.status(200).json({
            message: "user profile updated successfully.",
            user,
            success: true
        })

    } catch (error) {
        console.log(error);
  return res.status(500).json({
    message:"internal server error, Please try again later",
    success:false
        })
    }
}