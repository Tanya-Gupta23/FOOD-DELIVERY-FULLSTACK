import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (file) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
        const uploadResult = await cloudinary.uploader.upload(file);
        fs.unlinkSync(file);// local temporary file delete
        return uploadResult.secure_url;
    } catch (error) {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }

        console.log("Cloudinary upload error:", error);
        return null;
    }
};

export default uploadOnCloudinary;