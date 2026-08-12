import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";

function CreateEditShop() {
    const navigate = useNavigate();
    const { myShopData } = useSelector((state) => state.owner);
    const { currentCity, currentState, currentAddress } = useSelector((state) => state.user);
    const [image, setImage] = useState(null);
    const [name, setName] = useState(myShopData?.name || "");
    const [city, setCity] = useState(myShopData?.city || currentCity);
    const [state, setState] = useState(myShopData?.state || currentState)
    const [address, setAddress] = useState(myShopData?.address || currentAddress);
    const [frontendImage, setFrontendImage] = useState(myShopData?.image || null);
    const [backendImage, setBackendImage] = useState(null);
    const [loading,setLoading]= useState(false)
    const dispatch= useDispatch()
    const handleImage = (e) => {
          const file = e.target.files[0];    
          setBackendImage(file);
          setFrontendImage(URL.createObjectURL(file));
        };
    const handleSubmit= async (e)=>{
        e.preventDefault()
        setLoading(true)
        try {
            const formData= new FormData()
            formData.append("name", name)
            formData.append("city", city)
            formData.append("state", state)
            formData.append("address", address)
            if(backendImage){
                formData.append("image", backendImage)
            }

            const result= await axios.post(`${serverUrl}/api/shop/create-edit`, formData,{withCredentials:true})
            dispatch(setMyShopData(result.data))
            console.log(result.data)
            setLoading(false)
            navigate("/")
        } catch (error) {
            console.log(error)
            setLoading(false)
            
        }

    }
    return (
        <div className="flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen">

            <div
                className="absolute top-[20px] left-[20px] z-[10] mb-[10px]"
                onClick={() => navigate("/")}
            >
                <IoIosArrowRoundBack
                    size={35}
                    className="text-[#ff4d2d]"
                />
            </div>

            <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100">

                <div className="flex flex-col items-center mb-6">
                    <div className="bg-orange-100 p-4 rounded-full mb-4">
                        <FaUtensils className="text-[#ff4d2d] w-16 h-16" />
                    </div>

                    <div className="text-3xl font-extrabold text-gray-900">
                        {myShopData ? "Edit Shop" : "Add Shop"}
                    </div>
                </div>
                <form className="w-full flex flex-col gap-5 mt-6" onSubmit={handleSubmit}>

                    {/* Shop Image */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Restaurant Image
                        </label>

                        <input

                        type="file"
                        accept="image/*"
                        
                        className="w-full border border-gray-300 rounded-xl p-2
                        file:bg-[#ff4d2d] file:text-white file:border-0
                        file:px-4 file:py-2 file:rounded-lg
                        file:cursor-pointer cursor-pointer"
                        onChange={handleImage}
                        />
                        <div>
                            {frontendImage && (
                              <div className="mt-4">
                                <img
                                  src={frontendImage}
                                  alt=""
                                  className="w-full h-48 object-cover rounded-lg border"
                                />
                              </div>
                            )}
                        </div>
                    </div>

                    {/* Shop Name */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Restaurant Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter restaurant name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl
                            px-4 py-3 outline-none focus:border-[#ff4d2d]"
                        />
                    </div>

                    {/* City & State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                City
                            </label>

                            <input
                                type="text"
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl
                                px-4 py-3 outline-none focus:border-[#ff4d2d]"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                State
                            </label>

                            <input
                                type="text"
                                placeholder="State"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl
                                px-4 py-3 outline-none focus:border-[#ff4d2d]"
                            />
                        </div>

                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Address
                        </label>

                        <textarea
                            rows={4}
                            placeholder="Enter complete address..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl
                            px-4 py-3 outline-none resize-none
                            focus:border-[#ff4d2d]"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-[#ff4d2d] text-white
                        py-3 rounded-xl font-semibold
                        hover:bg-orange-600 transition-all duration-300 cursor-pointer" disabled={loading}
                    >
                        {loading ? <ClipLoader size={20} color='white'/>: "Save Changes"}
                        
                    </button>

                </form>

            </div>
        </div>
    );
}

export default CreateEditShop;
