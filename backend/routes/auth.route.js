import express from "express"
import {
    signIn, signOut, signUp, sendOtp, verifyOtp, resetPassword,
    googleAuth
} from "../controllers/auth.controllers.js"

const authRouter = express.Router()



// Authentication
authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.get("/signout", signOut);

// Forgot Password
authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/google-auth", googleAuth);

export default authRouter