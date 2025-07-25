import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true,
            index: true
        }, 

         email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true
        }, 
         fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        }, 
        avatar:{
            type: String,  // cloudinary URL
            required : true,
             
        },
        coverImage: {
              type: String,  // cloudinary URL
        },
        watchHisotry:[
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password:
        {
            type: String,
            required: [true,'Password is required']    
        },
        refreshToken:
        {
            type: String
        }

    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10)
    next()
    
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
   return jwt.sign(
        {
            _id: this_id,
            email: this.email,
            username: this.username,
            fullName: this.fullName

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
   return jwt.sign(
        {
            _id: this_id,

        },
        process.env.REFERESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFERESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)