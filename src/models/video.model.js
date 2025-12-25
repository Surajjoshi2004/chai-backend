import mongoose, {Schema, SchemaType} from "mongoose"
import jwt 
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const VideoSchema = new Schema({
    
        videoFile: {
            type: String,       //cloudinary
            required: true
        },

        thumbnail:{
            type: String,       //cloudinary linkn
            required: true,
        },

        title:{
            type: String,   
            requried: true, 
        },

        description:{
            type: String, 
            requied: true,
        },

        duration:{
            type: Number,
            required: true
        },

        views:{
            type: Number,
            default: 0
        },

        isPublishede: {
            type: Boolean,
            default: true
        },

        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {timestamps: true}

)

export const Video = mongoose.model("video",videoSchema)