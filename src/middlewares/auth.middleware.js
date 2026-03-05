//this middleware will check if there is user of not
import { ApiError } from "../utils/ApiError"
import { asyncHandler } from "../utils/asyncHandler"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model"



export const verifyJWT = asyncHandler(async(req,_,next)=> {

    //req ke pass cookies ka acess h

   try {
    const token = req.cookies?.accessToken  || req.header("Authorization")?.replace("Bearer ","")
 
     if(!token)
     {
         throw new ApiError(401, "Unathorised request")
     }
 
                                     //two paramaters are used
    const decodedToken =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
   const user =  await User.findById(decodedToken?._id).select
    ("-password -refreshToken")
 
    if(!user)
    {    //Todo discuss about frontend
         throw new ApiError(401, "Invalid  Access Token")
    }
 
    req.user = user;
 
    next()
 
   } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access Token")
   }

    
})