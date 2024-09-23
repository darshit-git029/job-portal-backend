import { v2 as cloudinary } from 'cloudinary'

import dotenv from "dotenv"

dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUDE_NAME,
    api_key:process.env.API_KRY,
    api_secret:process.env.APY_SCERET
})

export default cloudinary