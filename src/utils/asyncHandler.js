// const asyncHandler = () =>{} //using promises here
const asyncHandler = (requestHandler) =>{
   return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
    }
}
export {asyncHandler}


// this is the same thing but with 

// const asyncHandler = (fn) => async (req, res, next) => {
//     try{
//         await fn(req,res,next)
//     }

//     catch(error){

//         res.status(err.code || 500).json({
//             sucess: false,
//             message: err.message
//         })

//     }
// }


// steps
// const asyncHandler = ()=> {};

// const asyncHandler = (function) => ()=>{}

// cons asyncHandler = (function) => async()=>{}