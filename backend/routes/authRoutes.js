import express from "express"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

const router = express.Router()


const generateAccessToken = (user) => {
    return jwt.sign({id: user._id},process.env.ACCESS_SECRET,{expiresIn:"30m"})
}

const generateRefreshToken = (user) => {
    return jwt.sign({id:user._id},process.env.REFRESH_SECRET,{expiresIn:"7d"})
}

router.post('/register',async (req,res) => {
  try {
    const {email,username,password} = req.body;

    if(!email || !username || !password ){
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message:"Email already exists."})
    }

    const existingUsername = await User.findOne({username});
    
    if(existingUsername){
        return res.status(400).json({message:"Username already exists."})
    }

    const hashedPassword = await bcrypt.hash(password,10)
    const newUser = await User.create({username,email,password : hashedPassword});

    res.status(201).json({
      message: "Account created successfully",
      user: {
        _id: newUser._id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
        followersCount: newUser.followers.length,
        followingCount: newUser.following.length
      }
    })
  } catch (err) {
    console.error('REGISTER ERROR:',err)
    res.status(500).json({message:"Server error. Please try again later"});
  }
})

router.post('/login',async (req,res) => {
    try {

        const {email,password} = req.body;

        const user = await User.findOne({email:email})
        if(!user){
            return res.status(400).json({message: "User not found."})
        }

        const isPasswordValid = await bcrypt.compare(password,user.password)
        if(!isPasswordValid){
            return res.status(400).json({message: "Incorrect password."})
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure: process.env.NODE_ENV === "production", 
            sameSite:"Strict"
        })

        // res.json({accessToken,username:user.username})
        // res.json({accessToken,user})

        res.json({
            accessToken,
            user: {
              _id: user._id,
              username: user.username,
              name: user.name,
              email: user.email,
              bio: user.bio,
              profilePic: user.profilePic,
              followersCount: user.followers.length,
              followingCount: user.following.length
            }
          })
    } catch (err) {
        console.error(`Error: ${err}`)
        return res.status(500).json({ message: "Internal Server Error" });  // Return error message for internal error
    }
})


router.post("/refresh",(req,res) => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.sendStatus(403);
    }

    jwt.verify(refreshToken,process.env.REFRESH_SECRET,(err,user) => {
        if(err){
            console.error("Error verifying refresh token:", err);
            return res.sendStatus(403);
        }

        const accessToken = generateAccessToken({id:user.id})
        res.json({accessToken})
        })
    })

router.post("/logout",(req,res) => {
    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        sameSite:'Strict'
    })
    res.json({message : "Logged out successfully"})
})

export default router