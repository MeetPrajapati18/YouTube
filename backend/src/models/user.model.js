// import mongoose, {Schema} from "mongoose";
// import jwt from "jsonwebtoken"
// import bcrypt from "bcrypt"

// const userSchema = new Schema(
    
//     {
//         username: {
//             type: String,
//             required: true,
//             unique: true,
//             lowercase: true,
//             trim: true, 
//             index: true
//         },
//         email: {
//             type: String,
//             required: true,
//             unique: true,
//             lowecase: true,
//             trim: true, 
//         },
//         fullName: {
//             type: String,
//             required: true,
//             trim: true, 
//             index: true
//         },
//         avatar: {
//             type: String, // cloudinary url
//             required: false,
//         },
//         coverImage: {
//             type: String, // cloudinary url
//         },
//         watchHistory: [
//             {
//                 type: Schema.Types.ObjectId,
//                 ref: "Video"
//             }
//         ],
//         password: {
//             type: String,
//             required: [true, 'Password is required']
//         },
//         refreshToken: {
//             type: String
//         }

//     },
//     {
//         timestamps: true
//     }
// )

// userSchema.pre("save", async function (next) {
//     if(!this.isModified("password")) return next();
//     this.password = await bcrypt.hash(this.password, 10)
//     next()
// })

// userSchema.methods.isPasswordCorrect = async function(password){
//     return await bcrypt.compare(password, this.password)
// }

// userSchema.methods.generateAccessToken = function(){
//     return jwt.sign(
//         {
//             _id: this._id,
//             email: this.email,
//             username: this.username,
//             fullName: this.fullName
//         },
//         process.env.ACCESS_TOKEN_SECRET,
//         {
//             expiresIn: process.env.ACCESS_TOKEN_EXPIRY
//         }
//     )
// }
// userSchema.methods.generateRefreshToken = function(){
//     return jwt.sign(
//         {
//             _id: this._id,
            
//         },
//         process.env.REFRESH_TOKEN_SECRET,
//         {
//             expiresIn: process.env.REFRESH_TOKEN_EXPIRY
//         }
//     )
// }

// export const User = mongoose.model("User", userSchema)



import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Fixed typo (was "lowecase")
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Fixed typo (was "lowecase")
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // Cloudinary URL
      required: false,
      default: "", // Ensures the field always has a default value
    },
    coverImage: {
      type: String, // Cloudinary URL
      required: false,
      default: "", // Ensures the field always has a default value
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
        required: false,
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
      default: null, // Optional field
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Hash the password before saving the user document
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Check if the provided password matches the hashed password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate an access token for the user
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Generate a refresh token for the user
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
