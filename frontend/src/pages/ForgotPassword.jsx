import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners"
function ForgotPassword() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr]= useState("")
      const [loading, setLoading]= useState(false)

    const primary = "#ff4d2d";
    const hover = "#e64323";
    const borderColor = "#dddddd";
    const textDark = "#2d1f1a";

    //function for sending otp:
    const handleSendOtp=async ()=>{
        setLoading(true)
        try {
            
            const result= await axios.post(`${serverUrl}/api/auth/send-otp`,{email},{withCredentials:true})
            console.log(result)
            setStep(2)
            setErr("")
            setLoading(false)
        } catch (error) {
            setErr(error?.response?.data?. message)
            setLoading(false)
        }
    }

    //functionn for verifyinhg the otp
    const handleVerifyOtp=async ()=>{
        setLoading(true)
        try {
             
            const result= await axios.post(`${serverUrl}/api/auth/verify-otp`,{email,otp},{withCredentials:true})
            console.log(result)
            setStep(3)
        setErr("")
         setLoading(false)
        } catch (error) {
            setErr(error?.response?.data?. message)
             setLoading(false)
        }
    }

    //functionn for reseting password the otp
    const handlResetPassword = async () => {
    if (password !== confirmPassword) {
        setErr("Passwords do not match");
        setLoading(false);
        return;
    }

    setLoading(true);

    try {
        const result = await axios.post(
            `${serverUrl}/api/auth/reset-password`,
            { email, password },
            { withCredentials: true }
        );

        console.log(result);
        setErr("");
        setLoading(false);
        navigate("/signin");
    } catch (error) {
        setErr(error?.response?.data?.message);
        setLoading(false);
    }
};
    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-[#fff9f6]">
            <div
                className="bg-white rounded-xl shadow-lg w-full max-w-md p-8"
                style={{ border: `1px solid ${borderColor}` }}
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <IoIosArrowRoundBack
                        size={30}
                        className="text-[#ff4d2d] cursor-pointer"
                        onClick={() => navigate("/signin")}
                    />

                    <h1
                        className="text-1xl font-bold"
                        style={{ color: primary }}
                    >
                        Forgot Password
                    </h1>
                </div>

                <p className="text-sm mb-6" style={{ color: textDark }}>
                    {step === 1 &&
                        "Enter your registered email to receive an OTP."}

                    {step === 2 &&
                        "Enter the OTP sent to your email."}

                    {step === 3 &&
                        "Create a new password for your account."}
                </p>

                {/* STEP 1 */}
                {step === 1 && (
                    <>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg outline-none mb-5"
                            style={{
                                border: `1px solid ${borderColor}`,
                            }}
                        />

                        <button
                            onClick={() => setStep(2)}
                            className="w-full py-3 rounded-lg text-white font-semibold"
                            style={{ background: primary }}
                            onMouseEnter={(e) =>
                                (e.target.style.background = hover)
                            }
                            onMouseLeave={(e) =>
                                (e.target.style.background = primary)
                            }
                            onClick= {handleSendOtp} disabled={loading}
                        >
                            {loading?<ClipLoader size={20} color='white'/>: "Send OTP" }
                            
                        </button>
            {err && <p className='text-red-500 text-center my-[10px]'>{err}</p>}

                    </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg outline-none mb-5"
                            style={{
                                border: `1px solid ${borderColor}`,
                            }}
                        />

                        <button
                            onClick={() => setStep(3)} disabled={loading}
                            className="w-full py-3 rounded-lg text-white font-semibold"
                            style={{ background: primary }}
                            onMouseEnter={(e) =>
                                (e.target.style.background = hover)
                            }
                            onMouseLeave={(e) =>
                                (e.target.style.background = primary)
                            }
                            onClick={handleVerifyOtp}
                        >
                            {loading?<ClipLoader size={20} color='white' />: "Verify OTP" }
                            
                        </button>
            {err && <p className='text-red-500 text-center my-[10px]'>{err}</p>}

                    </>
                )}

                {/* STEP 3 */}
                {/* STEP 3 */}
                {step === 3 && (
                    <>
                        {/* New Password */}
                        <div className="mb-5">
                            <label
                                className="block text-sm font-medium mb-2"
                                style={{ color: textDark }}
                            >
                                New Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter New Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 pr-12 rounded-lg outline-none"
                                    style={{
                                        border: `1px solid ${borderColor}`,
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                >
                                    {showPassword ? (
                                        <FaRegEyeSlash />
                                    ) : (
                                        <FaRegEye />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-6">
                            <label
                                className="block text-sm font-medium mb-2"
                                style={{ color: textDark }}
                            >
                                Confirm Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 pr-12 rounded-lg outline-none"
                                    style={{
                                        border: `1px solid ${borderColor}`,
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    } disabled={loading}
                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                >
                                    {showConfirmPassword ? (
                                        <FaRegEyeSlash />
                                    ) : (
                                        <FaRegEye />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            className="w-full py-3 rounded-lg text-white font-semibold"
                            style={{ background: primary }}
                            onMouseEnter={(e) =>
                                (e.target.style.background = hover)
                            }
                            onMouseLeave={(e) =>
                                (e.target.style.background = primary)
                            }
                            onClick={handlResetPassword}
                        >
                            {loading?<ClipLoader size={20} color='white' />: "Reset Password" }
                            
                        </button>
            {err && <p className='text-red-500 text-center my-[10px]'>{err}</p>}

                    </>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;
