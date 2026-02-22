import {v2 as cloudinary} from "cloudinary";
import fs from "fs"




// const uploadOnCloudinary = async (localFilePath) => {
//     try{
//         if(!localFilePath) return null;
//         //upload the file on cloudinary

//         const response = await cloudinary.uploader.upload(localFilePath,{
//             resource_type: "auto"
//         })

//         console.log("Cloudinary error -> ", error);
//          if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath);
//     }

//         //file has been uploaded successfully
//         console.log("file is uploaded on cloudinary successfully", response.url);

//         return response;
//     }

//     catch(error){
//         fs.unlinkSync(localFilePath)  //remove the locally saved temp file as the upload operation got failed
//         return null;
//     }
// }

const uploadOnCloudinary = async (localFilePath) => {

    cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
    try {
        if(!localFilePath) return null;
        
        console.log("🟡 UPLOADING TO CLOUDINARY →", localFilePath) // add this
        
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        
        console.log("✅ CLOUDINARY SUCCESS →", response.url) // add this
        fs.unlinkSync(localFilePath);
        return response;
    }
    catch(error) {
        console.log("🔴 CLOUDINARY ERROR →", error.message) // add this
        if(fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
        return null;
    }
}

export {uploadOnCloudinary}