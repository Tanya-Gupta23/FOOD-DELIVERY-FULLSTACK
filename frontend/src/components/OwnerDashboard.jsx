import React from "react";
import Nav from "../components/Nav";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import OwnerItemCard from "./OwnerItemCard";

function OwnerDashboard() {
  const { myShopData } = useSelector(state => state.owner)
  const navigate = useNavigate()
  
  return (
    <div className="w-full min-h-screen bg-#[fff9f6] flex flex-col items-center">
      <Nav />
      {!myShopData &&
        <div className="flex justify-center items-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl
        p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Add Your Restaurant
              </h2>

              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Join Feasto and connect with thousands of hungry customers by showcasing your restaurant online.
              </p>
              <button className="bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full 
              font-medium shadow-md hover:bg-orange-600 transition-colors duration-200"
                onClick={() => navigate("/create-edit-shop")}>
                Get Started
              </button>

            </div>

          </div>
        </div>
      }
      {myShopData &&
        <div className="w-full flex flex-col items-center">

          {/* Welcome */}
          <div className="flex items-center gap-3 mb-6">
            <FaUtensils
              className="text-[#ff4d2d]"
              size={30}
            />

            <h2 className="text-3xl font-semibold text-gray-700">
              Welcome to {myShopData.name}
            </h2>
          </div>

          {/* Shop Card */}
          <div
  className="relative w-full max-w-xl bg-white rounded-xl shadow-lg
  overflow-hidden transition-all duration-300
  hover:shadow-2xl hover:-translate-y-1"
>

            <img
              src={myShopData.image}
              alt={myShopData.name}
              className="w-full h-60 object-cover"
            />

            <div
  className="absolute top-4 right-4 bg-[#ff4d2d] text-white p-2
  rounded-full shadow-md hover:bg-orange-600 transition-colors
  cursor-pointer"
  onClick={() => navigate("/create-edit-shop")}
>
  <FaPen size={20} />
</div>

            <div className="p-5">

              <h2 className="text-2xl font-bold">
                {myShopData.name}
              </h2>

              <p className="text-gray-500 mt-2">
                {myShopData.address}
              </p>

            </div>

          </div>


          {myShopData.items.length==0&&
          <div className="flex justify-center items-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl
        p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Add Your Food Item
              </h2>

              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Share your delecious creations with our customers by adding them to the menu
              </p>
              <button className="bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full 
              font-medium shadow-md hover:bg-orange-600 transition-colors duration-200"
                onClick={() => navigate("/add-item")}>
                Add Food
              </button>

            </div>

          </div>
        </div>}


        {myShopData.items.length>0 && 
        <div className="flex flex-col items-center gap-6 w-full max-w-3xl mt-8">
          {
            myShopData.items.map((item, index)=>(
              <OwnerItemCard data={item} key={index}/>
            ))
          }
        </div>
        }

        </div>





      }
    </div>

  )
}
export default OwnerDashboard