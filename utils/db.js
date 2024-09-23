import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOO_URL)
        console.log("mongoodb is connect successfully");
        
    } catch (error) {
        console.log(error);
        
    }
}

export default connectDB;