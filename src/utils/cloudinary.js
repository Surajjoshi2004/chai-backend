import {v2 as cloudinary} from "cloudinary";
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null;
        //upload the file on cloudinary

        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })

        //file has been uploaded successfully
        console.log("file is uploaded on cloudinary successfully", response.secure_url || response.url);

        // cleanup temp file after successful upload
        try {
            fs.unlinkSync(localFilePath);
        } catch {
            // ignore cleanup errors
        }

        return response;
    }

    catch(error){
        console.error("Cloudinary upload failed:", {
            message: error?.message,
            name: error?.name,
            http_code: error?.http_code,
            path: localFilePath,
        });

        try{
            if (localFilePath && fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath)  //remove the locally saved temp file as the upload operation got failed
            }
        } catch {
            // ignore cleanup errors
        }
        return null;
    }
}


export {uploadOnCloudinary}