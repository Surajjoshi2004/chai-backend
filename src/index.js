// 
import dotenv from "dotenv"
import connectDB from "./db/index.js"
dotenv.config();

// import express, { application } from "express"

// const app = express()


// ;(async () =>{
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error", (error)=> {
//             console.log("ERR: ", error);
//             throw error
//         })

//         app.listen(process.env.PORT, ()=> {
//             console.log(`PP is listening to port {process.env.PORT}`)
//         })
//     }
//     catch (error){
//         console.error("ERROR: ",error)
//     }
// })

connectDB()