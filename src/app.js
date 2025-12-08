import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORSE_ORIGIN,  // tells from where specifically we ne can accept data
    credintials: true
}))

app.use(express.json({limit: "16kb"}))

app.use(express.urlencoded({extended: true, limit:"16kb"}))

app.use(express.static("public"))

app.cookieParser

export {app}