import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"


const registerUser = asyncHandler(async(req, res) => {
    // get user details from frontend
    // validation the user details
    // chec if user already exists usernam,email  // .includes can check @ is there or not
    // check for images, check for avatar
    // upload them to cloudinary, avat ar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation 
    // return res

    console.log("🔴 REQ.FILES →", req.files)
    console.log("🔴 REQ.FILE →", req.file)
    console.log("🔴 CONTENT TYPE →", req.headers['content-type'])
    

    const {fullName, email,username, password} = req.body
    console.log("email: ", email);

    if([fullName, email, username, password].some(field => field?.trim()  === "")) {
    throw new ApiError(400, "All fields are required");
}


    //user call karlega mongodb   //findOne batata hai pehla user jiske pass ye h
    const existedUser = await User.findOne({
        $or : [{username}, {email}]
    })

    if(existedUser)
    {
        throw new ApiError(409, "User with email or username already exists")
    }

    //middleware req ke baad aur parameter add kr deta h 
    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    let coverImageLocalPath;

    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0)
    {
        coverImageLocalPath = req.files.coverImage[0].path
    }



    //condition to check is avatarimage is there or not 

    if(!avatarLocalPath)
    {
        throw new ApiError(400, "Avatar file is required")
    }

    //cover image hai nhi chalega

    //cloudinary pe check kar liya h
    const avatar = await uploadOnCloudinary(avatarLocalPath) 

    let coverImage = null

    if(coverImageLocalPath)
    {
     coverImage = await uploadOnCloudinary(coverImageLocalPath);
    }

    if(!avatar)
    {
        throw new ApiError(400, "Avatar is required")
    }


    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",      //check kar rha ki hai ki nhi warna emtpy
        email, 
        password, 
        username: username.toLowerCase()
    })

    //mongodb apne aaap ek id deta h use use karke ham chekc
    //kr sakte hai ki user hai ki nhi 
    const createdUser = await User.findById(user._id).select("-password -refreshToken")    //kya kya nhi chaiye ye likha hua hai parameter mein 
    

    if(!createdUser)
    {
        throw new ApiError(500, "Something went wrong while registering the user ")
    }

    return res.status(201).json(

        new ApiResponse(201,createdUser,"User registered successfully" )

    )


    
 
})

const loginUser = asyncHandler(async(req,res)=> {
    // req body ->data
    //username email hai ki nhi h
    //
})
export {registerUser, 
    loginUser
}