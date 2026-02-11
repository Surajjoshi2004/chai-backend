import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";

const registerUser = asyncHandler(async(req, res) => {
    // get user details from frontend
    // validation the user details
    // chec if user already exists usernam,email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation 
    // return response to frontend

    const {fullName, email,username, password} = req.body
    console.log("email: ", email);

    if([fullName,email,username,password].some((field) => field))
    {
        throw new ApiError(400, "Fullname is required")
    }

    
 
})

export {registerUser}