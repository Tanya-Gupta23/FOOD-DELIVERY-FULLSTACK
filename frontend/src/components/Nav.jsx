import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setSearchItems, setUserData } from "../redux/userSlice";
import { FaPlus } from "react-icons/fa6";
import { TbReceiptRupee } from "react-icons/tb";
import { setMyShopData } from "../redux/ownerSlice";


function Nav() {

  const { userData, currentCity, cartItems } = useSelector(state => state.user)
  const { myShopData } = useSelector(state => state.owner)
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
const[query, setQuery]= useState("")
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true
      });
      dispatch(setMyShopData(null));
      dispatch(setUserData(null));
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };

    const handleSearchItems= async (query)=>{
      try {
        if (!query.trim()) {
      dispatch(setSearchItems([]));
      return;
    }
        
        const result= await axios.get(`${serverUrl}/api/item/search-items?query=${query}&city=${currentCity}`,{withCredentials: true})
        console.log(result.data)
        dispatch(setSearchItems(result.data))
      } catch (error) {
        console.log(error)
        
      }
    }

    useEffect(()=>{
      if(query){
      handleSearchItems(query)
      }
      else{
        dispatch(setSearchItems(null))
      }
      

    },[query])

  return (
    <div className="w-full h-[80px] flex items-center justify-between 
    md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999] bg-[#fff9f6] overflow-visible">

      {/*When showSearch is true only then search not for big devices */}
      {showSearch && userData.role == "user" &&
        <div className="w-[90%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-[20px] flex md:hidden fixed top-[80px] left-[5%]">

          <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
            <FaLocationDot size={25} className="text-[#ff4d2d] shrink-0" />
            <div className="truncate text-gray-600">{currentCity || "Getting location..."}</div>
          </div>

          <div className="flex-1 min-w-0 flex items-center gap-[10px]">
            <IoIosSearch size={25} className="text-[#ff4d2d] shrink-0" />

            <input
              type="text"
              placeholder="Search delicious food..."
              className="px-[10px] text-gray-700 outline-0 w-full min-w-0"
              onChange={(e)=>setQuery(e.target.value)} value={query}


            />
          </div>

        </div>
      }

      <h1 className="text-3xl font-bold mb-2 text-[#ff4d2d]">
        Feasto
      </h1>
      {/*  Search Bar */}
      {userData?.role == "user" &&
        <div className="hidden md:flex md:w-[60%] lg:w-[40%] h-[70px]
  bg-white shadow-xl rounded-lg items-center gap-[20px]">

          <div className="flex items-center w-[30%] overflow-hidden gap-[10px]
    px-[10px] border-r-[2px] border-gray-400">

            <FaLocationDot size={25} className="text-[#ff4d2d] shrink-0" />
            <div className="truncate text-gray-600">{currentCity || "Getting location..."}</div>
          </div>
          {/* Desktop Search Bar */}


          <div className="flex-1 min-w-0 flex items-center gap-[10px]">
            <IoIosSearch size={25} className="text-[#ff4d2d] shrink-0" />

            <input
              type="text"
              placeholder="Search delicious food..."
              className="px-[10px] text-gray-700 outline-0 w-full min-w-0"
              onChange={(e)=>setQuery(e.target.value)} value={query}
            />
          </div>
        </div>
      }



      {/*  Items on the right side of the page */}
      <div className="flex items-center gap-4">
        {userData?.role === "user" && (
          <IoIosSearch
            size={25}
            className="text-[#ff4d2d] shrink-0 md:hidden cursor-pointer"
            onClick={() => setShowSearch(prev => !prev)}
          />
        )}


        {/*  Add items button for owner */}
        {userData.role == "owner" ?
          <>
          {myShopData&& <>
          <button className="hidden md:flex items-center gap-1 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]" onClick={()=>navigate("/add-item")}>
              <FaPlus size={14} />
              <span>Add Food Item</span>
            </button>
            {/*  Add items button for owner for small items*/}

            <button className="md:hidden flex items-center p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]"  onClick={()=>navigate("/add-item")}>
              <FaPlus size={14} />

            </button>
            </>
          }
            
            {/*  My Orders for owner */}
            {userData?.role === "owner" && (
              <>
              <div className="hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium " onClick={()=>navigate("/my-orders")}>
                <TbReceiptRupee size={20}/>
                <span >My Orders</span>
                
              </div>

              <div className="md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium "onClick={()=>navigate("/my-orders")}>
                <TbReceiptRupee size={20}/>
                
                
              </div>
              </>

              



            )}
          </>
          : (
            <>
              {/*  Cart */}
              {userData.role=="user" &&

              <div className="relative cursor-pointer" onClick={()=>navigate("/cart")}>
                <FiShoppingCart size={25} className="text-[#ff4d2d]" />
                <span className="absolute right-[-9px] top-[-12px] text-[#ff4d2d]">
                  {cartItems.length}
                </span>
              </div>}


              {/*  My Order */}
              <button className="hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium"onClick={()=>navigate("/my-orders")}>
                My Orders
              </button>
            </>
          )}






        {/*     Profile icon& popup */}
        <div className="w-[40px] h-[40px] rounded-full flex items-center
 justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl 
 font-semibold cursor-pointer" onClick={() => setShowInfo(prev => !prev)}>
          {userData?.fullName?.slice(0, 1)}  {/*     first letter*/}
        </div>
        {/*  if showInfo is true then only we can see the popup */}
        {showInfo && (<div className="fixed top-[80px] right-[10px] md:right-[10%] 
lg:right-[25%] w-[180px] bg-white shadow-2xl rounded-xl
 p-[20px] flex flex-col gap-[10px] z-[9999]">

          {/*     name */}
          <div className="text-[17px] font-semibold text-gray-800">
            {userData?.user?.fullName}
          </div>
          {/* my order for small devices */}

          <div className="md:hidden text-[#ff4d2d] font-semibold cursor-pointer"onClick={()=>navigate("/my-orders")}>
            My Orders
          </div>

          {/*  log out */}
          <div className="text-[#ff4d2d] font-semibold cursor-pointer" onClick={handleLogout}>
            Log Out
          </div>



        </div>)}

      </div>
    </div>




  )
}

export default Nav