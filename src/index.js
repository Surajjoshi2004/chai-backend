import dotenv from "dotenv"
dotenv.config({
    path:"./.env"
});


import connectDB from "./db/index.js"
import {app} from "./app.js"


//this is when we do connection in the same file as index.js not on the another file
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

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});
connectDB().then(()=>                   // calling method from that index.js
     app.listen(process.env.PORT || 5000, 
        ()=>{
    console.log(`process is running at ${process.env.PORT}`)
}))
.catch(
    (err)=>
    {
    console.log("Error connecting monogodb", err);
}
)