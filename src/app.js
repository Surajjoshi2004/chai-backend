import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,  // tells from where specifically we ne can accept data
    credentials: true
}))

//kahi se bhi data aa sakta h
//settings hai ye taki dikkat na ho
app.use(express.json({limit: "16kb"}))

//url se data aa rha 
app.use(express.urlencoded({extended: true, limit:"16kb"}))

//want to store files or folder such as pdf ye sab
app.use(express.static("public"))

//cookie ko set karo taki use kar pau jaise password ssave kr liya thode der ke liye
app.use(cookieParser())


//routes import 
import userRouter  from "./routes/user.routes.js"


//routes declaration
app.use("/api/v1/users",userRouter); //http://localhost:5000/api/v1/users/register

export {app}