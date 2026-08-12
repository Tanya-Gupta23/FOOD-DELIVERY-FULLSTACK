//token jo cookie ke andr store kia tha signin or sign up karte time-->> usko yhan access karenge--->>or uss token mein se user id find karenge-->>usko hmm currrent user ka controller bna ke vahan se bhej denge-->frontend mein usko fetch kar denge
//middleware: between req and controller
/*Frontend
    │
    │ Sign In request
    ▼
Backend
    │
    │ JWT banaya
    │ Set-Cookie bheji
    ▼
Browser
    │
    │ Cookie save kar li
    ▼
User doosri request karta hai
    │
    │ Browser automatically cookie attach karta hai
    ▼
Backend
    │
    │ cookie-parser
    ▼
req.cookies.token
    │
    ▼
jwt.verify()
    │
    ▼
Current User */

import jwt from "jsonwebtoken";
const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(400).json({ message: "Unauthorized: Token not found" });
        }
        const decodeToken= jwt.verify(token, process.env.JWT_SECRET)
        
        req.userId = decodeToken.userId;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or Expired Token"
        });

    }
}

export default isAuth;