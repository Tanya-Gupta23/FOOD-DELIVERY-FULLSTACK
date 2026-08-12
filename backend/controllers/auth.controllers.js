import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import genToken from "../utils/token.js"
import { response } from "express"
import { sendOtpMail } from "../utils/mail.js"

export const signUp = async (req, res) => {
    try {
        const { fullName, email, password, mobile, role } = req.body
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: " User already exists." })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." })
        }
        if (mobile.length < 10) {
            return res.status(400).json({ message: "Enter a valid mobile number." })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        user = await User.create({
            fullName,
            email,
            role,
            mobile,
            password: hashedPassword
        })


        const token = await genToken(user._id)
        //storing the cookie in browser with the name token with the value taken from above line const token
        res.cookie("token", token, {
            secure: true, // we are at dev stage that is why onlu http not https // In development we use HTTP, so secure is false.// In production (HTTPS), set secure: true.
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,// cookie stays in the browser for 7 days
            httpOnly: true  //// Prevents JavaScript from accessing the cookie (helps protect against XSS attacks)


        })

        return res.status(201).json(user)
    } catch (error) {
    if (error.name === "ValidationError") {
        const firstError = Object.values(error.errors)[0].message;

        return res.status(400).json({
            message: firstError
        });
    }

    return res.status(500).json({
        message: error.message
    });
}
}


export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: " User does not exist." })
        }


        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: " Incorrect password." })
        }


        const token = await genToken(user._id)
        res.cookie("token", token, {
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true


        })

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json(`sign in error ${error}`)

    }
}


export const signOut = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({ message: "logout successfully" })
    } catch (error) {
        return res.status(500).json(`sign out error ${error}`)
    }
}
//send otp
export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body// body se email le rahe hain jahn email bhejna hai
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: " User does not exist." })
        }
        if (!user.password) {
    return res.status(400).json({
        message: "This account was created with Google. Please sign in with Google."
    });
}
        const otp = Math.floor(1000 + Math.random() * 9000).toString()//6dig
        user.resetOtp = otp
        user.otpExpires = Date.now() + 5 * 60 * 1000
        user.isOtpVerified = false //abhi to otp dala nhi gaya hai to isslie false
        await user.save()
        await sendOtpMail(email, otp)
        return res.status(200).json({ message: "OTP sent successfully" })

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

//Verifying the OTP

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User does not exist." });
        }
        if (user.resetOtp != otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: " Invalid/ Expired OTP." })
        }
        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined
        await user.save()
        console.log("After Save:", user.isOtpVerified);
        return res.status(200).json({ message: "OTP verified successfully" })

    } catch (error) {
        return res.status(500).json(`verify OTP error ${error}`)
    }
}


//reset password
export const resetPassword = async (req, res) => {
    try {
        console.log("Body:", req.body);
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        console.log("User:", user);
        if (!user) {
            return res.status(400).json({
                message: "User does not exist."
            });
        }

        if (!user.isOtpVerified) {
            return res.status(400).json({
                message: "Please verify OTP first."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.isOtpVerified = false;

        await user.save();

        return res.status(200).json({
            message: "Password reset successfully."
        });

    } catch (error) {
        return res.status(500).json(`reset password error ${error}`)


    }
};


export const googleAuth = async (req, res) => {
    console.log(req.body);

    try {
        const { fullName, email, mobile, role } = req.body;

        let user = await User.findOne({ email });

        // Agar user nahi hai to naya create karo
        if (!user) {
            user = await User.create({
                fullName,
                email,
                mobile,
                role
            });
        }

        const token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json(user);

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: error.message
        });
    }
};
