import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

//method for generating access and refreshtokens
const generateAccessAndRefreshTokens = async(userId)=>
{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    }
    catch(error)
    {
        throw new ApiError(500, "Something went wrong while generating refresh and accesstoken")
    }
}

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
    //find the user
    // if there then password check
    // password write access and refresh token
    // send cookie

    const {email,username,password} = req.body

    if(!username && !email)
    {
        throw new ApiError(400, "username or email is required")
    }


    //user find karna hoga both email and username;
    // .findOne is the method of the function

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user)
    {
        throw new ApiError(404,"User does not exist")
    }
    
    

    //chekcing password from the user model having isPassword correct method
    const isPasswordValid = await user.isPasswordCorrect(password) 

    if(!isPasswordValid)
    {
        throw new ApiError(404, "User credentials invalid ")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


    //cookies settings 
    const options = {
        httpOnly: true,              //checks only changable from server
        secure:  process.env.NODE_ENV === "production" 
    }

    return res.status(200).cookie("accessToken",accessToken, options).cookie("refreshToken", refreshToken,options).
    json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,accessToken, 
                refreshToken
            },
            "User logged in Successufully"
        )
    )

})


const logoutUser = asyncHandler(async(req,res) => {
    //clear cookies
    //reset refreshtoken
    //user kha se lau kaise us user ko hatau
    //apna middleware design karenge logout ke liey
    //

   await User.findByIdAndUpdate( 
    req.user._id,
    {
        //set used to change values
        $set:{
            refreshToken:undefined
        }
    },

    {
        new: true
    }
   )
   const options = {
        httpOnly: true,              //checks only changable from server
        secure: true, 
    }

    return res.status(200).clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))

})


const refreshAccessToken = asyncHandler(async(req,res)=>{
   try {
    const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken
 
    if(!incomingRefreshToken)
    {
         throw new ApiError(401,"unauthorised request")
    }
 
    jwt.verify(
     incomingRefreshToken,
     process.env.REFRESH_TOKEN_SECRET
    )
 
    const user = await User.findById(decodedToken?._id)
 
    if(!user)
    {
     throw new ApiError(401,"Invalid refresh token")
    }
 
    if(incomingRefreshToken !== user?.refreshToken)
    {
         throw new ApiError(401,"Refresh token is expired or used")
    }
 
    const options = {
     httpOnly: true,
     secure: true
    }
 
    const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
 
 
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken, options)
    .json(
     new ApiResponse(
         200,
         {accessToken, refreshToken: newRefreshToken},
         "accessToken refreshed"
     )
    )
 
   } catch (error) {

    throw new ApiError(401,error?.message || "invalid refreshtoken")
   }

})


const changeCurrentPassword = asyncHandler(async(req, res) =>{
    const {oldPassword, newPassword} = req.body

    //user is already logged in so we can take id from loginone
   const user = await User.findById (req.user?._id)
   //checking if the password is correct
   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

   if(!isPasswordCorrect)
   {
        throw new ApiError(400, "Inavalid old password")
   }

   user.password = newPassword  //save hone se pehele middleware chalega
   await user.save({validateBeforeSave:false})

   return res
   .status(200)
   .json(new ApiResponse())
})


const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(200, req.user,"current user fetched successfully")
})


const updateAccountDetails = asyncHandler(async(req,res) => 
{
    const {fullName, email}  = req.body

    if(!fullName || !email)
    {
        throw new ApiError(400, "All fields are required")
    }

    const user = User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                fullName: fullName,
                email: email
            }
        },
        {new: true}
    ).select("-password")


    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details successfully"))


})


const updateUserAvatar = asyncHandler(async(req,res) =>
{
   const avatarLocalPath =  req.file?.path

   if(!avatarLocalPath)
   {
    throw new ApiError(400, "Avatar file is missing")
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath)

   if(!avatar.url)
   {
     throw new ApiError(400, "Error while uploading on avatar")
   }


   await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {new: true}
   ).select("-password")

    return res
   .status(200)
   .json(
        new ApiResponse(200, user, "avatar updated successfully")
   )


})

const updateUserCoverImage = asyncHandler(async(req,res) =>
{
   const coverImageLocalPath =  req.file?.path

   if(!coverImageLocalPath)
   {
    throw new ApiError(400, "Avatar file is missing")
   }

   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if(!coverImage.url)
   {
     throw new ApiError(400, "Error while uploading on avatar")
   }


   await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage:coverImage.url
            }
        },
        {new: true}
   ).select("-password")


   return res
   .status(200)
   .json(
        new ApiResponse(200, user, "cover image updated successfully")
   )


})
export {registerUser, 
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserAvatar,
    updateUserCoverImage
}