import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";

function EditItem() {
    const { itemId } = useParams();

    const [currentItem, setCurrentItem]= useState(null)
    const navigate = useNavigate();
    const { myShopData } = useSelector((state) => state.owner);

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);

    const [frontendImage, setFrontendImage] = useState("");
    const [backendImage, setBackendImage] = useState(null);
    const dispatch = useDispatch()
    const [category, setCategory] = useState("");
    const [foodType, setFoodType] = useState(currentItem?.foodType||"veg");
    const [loading, setLoading]= useState(false)
    
    const foodTypes = [
        "veg",
        "non-veg",
    ];
    const categories = [
        "Snacks",
        "Main Course",
        "Desserts",
        "Pizza",
        "Burgers",
        "Sandwiches",
        "South Indian",
        "North Indian",
        "Chinese",
        "Fast Food",
        "Others"
    ]
    const handleImage = (e) => {
        const file = e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("category", category)
            formData.append("foodType", foodType)
            formData.append("price", price)



            if (backendImage) {
                formData.append("image", backendImage)
            }

            const result = await axios.post(`${serverUrl}/api/item/edit-item/${itemId}`, formData, { withCredentials: true })
            dispatch(setMyShopData(result.data))
            console.log(result.data)
            setLoading(false)
            navigate("/")
        } catch (error) {
            console.log(error)
            setLoading(false)
        }

    }

    useEffect(()=>{
        const handleGetItemById=async ()=>{
            try {
                const result= await axios.get(`${serverUrl}/api/item/get-by-id/${itemId}`,
                {withCredentials:true})
                console.log(result.data);
                setCurrentItem(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        handleGetItemById()
    },[itemId])
    useEffect(() => {
    if (currentItem) {
        setName(currentItem?.name || "");
        setPrice(currentItem?.price || 0);
        setFrontendImage(currentItem?.image || "");
        setCategory(currentItem?.category || "");
        setFoodType(currentItem?.foodType||"veg");
    }
}, [currentItem]);
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
                        Edit Food
                    </div>
                </div>
                <form className="w-full flex flex-col gap-5 mt-6" onSubmit={handleSubmit}>

                    {/* Shop Image */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Food Image
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
                            Food Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter food name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl
                            px-4 py-3 outline-none focus:border-[#ff4d2d]"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Price
                        </label>

                        <input
                            type="number"
                            placeholder="0"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl
                            px-4 py-3 outline-none focus:border-[#ff4d2d]"
                        />
                    </div>


                    {/* Category */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Category
                        </label>

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3
    outline-none focus:border-[#ff4d2d] bg-white cursor-pointer"
                        >
                            <option value="">Select Category</option>

                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Food Type */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Food Type
                        </label>

                        <select
                            value={foodType}
                            onChange={(e) => setFoodType(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3
    outline-none focus:border-[#ff4d2d] bg-white cursor-pointer"
                        >
                            <option value="veg">Veg</option>
                            <option value="non-veg">Non Veg</option>
                        </select>
                    </div>






                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-[#ff4d2d] text-white
                        py-3 rounded-xl font-semibold
                        hover:bg-orange-600 transition-all duration-300 cursor-pointer" disabled={loading}>
                    {loading? <ClipLoader size={20} color='white'/>: "Save Changes"}
                        
                    </button>

                </form>

            </div>
        </div>
    );
}

export default EditItem;