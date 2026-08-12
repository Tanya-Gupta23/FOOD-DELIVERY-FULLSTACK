import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners"
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function SignIn() {

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [err, setErr]= useState("")
    const dispatch=useDispatch()


    const [password, setPassword] = useState("")
     const [loading, setLoading]= useState(false)
    const primary = '#ff4d2d';     // Vibrant coral red for main buttons and branding
    const hover = '#e64323';      // Darker burnt red for button hover actions
    const bg = '#fff9f6';        // Warm, cozy peach-tinted white for page backgrounds
    const borderColor = '#dddddd';       // Light gray for structural borders and dividers
    const textDark = '#2d1f1a'     // Deep, rich charcoal brown for readable typography


    const handleSignIn = async () => {
        setLoading(true)
        try {
            
            const result = await axios.post(`${serverUrl}/api/auth/signin`,
                {  email, password }, { withCredentials: true })
            dispatch(setUserData(result.data))
            navigate("/");
            setErr("")
            setLoading(false)
        } catch (error) {
            setErr(error?.response?.data?.message)
            setLoading(false)
        }

    }

    const handleGoogleAuth= async()=>{
        const provider= new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        

        try {
            const {data}= await axios.post(`${serverUrl}/api/auth/google-auth`,
                {
                email: result.user.email, 
                },{withCredentials: true})

                dispatch(setUserData(data))
                navigate("/");
        } catch (error) {
            console.log(error)
            alert(error.response?.data?.message);
        }
    }

    return (
        <div className='min-h-screen w-full flex items-center justify-center p-4'
            style={{ backgroundColor: bg }}>
            <div className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px] `} style={{ border: `1px solid ${borderColor}` }}>
                <h1 className={`text-3xl font-bold mb-2 text`} style={{ color: primary }}>Feasto</h1>
                <p
                    className=" text-sm mb-8"
                    style={{ color: textDark }}
                >
                    Sign in to your account to get started with Feasto.
                </p>




                {/* Email */}
                <div className="mb-5">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                        style={{ color: textDark }}
                    >
                        Email
                    </label>

                    <input
                        type="email"
                        id="fullName"
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-200"
                        style={{
                            border: `1px solid ${borderColor}`,
                        }}
                        onChange={
                            (e) => setEmail(e.target.value)
                        } value={email} required
                        onFocus={(e) =>
                            (e.target.style.border = `1px solid ${primary}`)
                        }
                        onBlur={(e) =>
                            (e.target.style.border = `1px solid ${borderColor}`)
                        }
                    />
                </div>





                {/* Password */}
                <div className="mb-5">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium mb-2"
                        style={{ color: textDark }}
                    >
                        Password
                    </label>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 pr-12 rounded-lg outline-none transition-all duration-200"
                            style={{
                                border: `1px solid ${borderColor}`,
                            }}
                            onChange={
                                (e) => setPassword(e.target.value)
                            } value={password}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                            style={{ color: "#777" }}
                        >
                            {showPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
                        </button>
                    </div>

                {/* Forgot Password */}
                </div>
                <div className="flex justify-end mt-2 mb-5">
                    <button
                        type="button"
                        className="text-sm font-medium hover:underline cursor-pointer"
                        style={{ color: primary }}
                        onClick={()=>navigate("/forgot-password")}
                    >
                        Forgot Password
                    </button>
                </div>




                {/* Sign Up Button */}
                <button
                    type="submit"
                    className="w-full py-3 mt-4 flex items-center justify-center gap-2 border rounded-lg font-semibold text-white transition-all duration-300 cursor-pointer"
                    style={{
                        backgroundColor: primary,
                    }}
                    onClick={handleSignIn} disabled={loading}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = hover)}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = primary)}
                >
                    {loading?<ClipLoader size={20} color='white'/>: "Sign In" }
                    
                </button>
                            {err && <p className='text-red-500 text-center my-[10px]'>{err}</p>}



                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="px-3 text-sm text-gray-500">OR</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Google Sign Up */}
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border transition-all duration-300 hover:shadow-md"
                    style={{
                        borderColor: borderColor,
                        color: textDark,
                        backgroundColor: "#fff",
                    }}
                    onClick={handleGoogleAuth}
                >
                    <FcGoogle size={22} />
                    <span className="font-medium">Sign In with Google</span>

                </button>

                {/* Already have an account */}
                <p className="text-center mt-5" style={{ color: textDark }} onClick={() => navigate("/signup")}>
                    Want to create a new account?{" "}
                    <span
                        className="font-semibold cursor-pointer"
                        style={{ color: primary }}
                    >
                        Sign Up
                    </span>
                </p>


            </div>



        </div>





    )
}



export default SignIn
