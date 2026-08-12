import React, { useEffect, useRef, useState } from 'react'
import Nav from './Nav'
import { categories } from '../category'
import CategoryCard from './CategoryCard'
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import Hero from "./Hero";
import FoodCard from './FoodCard';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';

function UserDashboard() {
  const {currentCity, shopsInMyCity, itemsInMyCity, searchItems}= useSelector(state=>state.user)
  const cateScrollRef = useRef()
  const shopScrollRef = useRef()
  const navigate= useNavigate()
  const [showLeftCateButton, setShowLeftCateButton] = useState(false)
  const [showRightCateButton, setShowRightCateButton] = useState(false)
    const [showLeftShopButton, setShowLeftShopButton] = useState(false)
  const [showRightShopButton, setShowRightShopButton] = useState(false)
  const [updatedItemsList, setUpdatedItemsList]= useState([])

  const handleFilterByCategory=(category)=>{
    if(category=="All"){
      setUpdatedItemsList(itemsInMyCity)
    }else{
      const filteredList= itemsInMyCity?.filter(i=>i.category===category)
      setUpdatedItemsList(filteredList)
    }

  }
  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity || []);
}, [itemsInMyCity]);
  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current
    if (element) {
      setLeftButton(element.scrollLeft > 0)
      setRightButton(element.scrollLeft + element.clientWidth < element.scrollWidth)

    }

  }
  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction == "left" ? -200 : 200,
        behavior: "smooth"
      })
    }
  }






  useEffect(() => {
  updateButton(
    cateScrollRef,
    setShowLeftCateButton,
    setShowRightCateButton
  );

  updateButton(
    shopScrollRef,
    setShowLeftShopButton,
    setShowRightShopButton
  );

  const handleCateScroll = () => {
    updateButton(
      cateScrollRef,
      setShowLeftCateButton,
      setShowRightCateButton
    );
  };

  const handleShopScroll = () => {
    updateButton(
      shopScrollRef,
      setShowLeftShopButton,
      setShowRightShopButton
    );
  };

  cateScrollRef.current?.addEventListener("scroll", handleCateScroll);
  shopScrollRef.current?.addEventListener("scroll", handleShopScroll);

  return () => {
    cateScrollRef.current?.removeEventListener("scroll", handleCateScroll);
    shopScrollRef.current?.removeEventListener("scroll", handleShopScroll);
  };
}, []);
useEffect(() => {
  updateButton(
    shopScrollRef,
    setShowLeftShopButton,
    setShowRightShopButton
  );
}, [shopsInMyCity]);
  return (
    <div className="w-full min-h-screen bg-#[fff9f6] flex flex-col items-center gap-10">
      <Nav />
      {searchItems && searchItems.length>0 && (
      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl mt-4'>
        <h1 className='text-gray-900 text-2xl sm:text-3xl font-semibold border-b border-gray-200 pb-2'>Search Results</h1>
        <div className='w-full h-auto flex flex-wrap gap-6 justify-center'>
          {searchItems.map((item)=>(
            <FoodCard data={item} key={item._id}/>
          ))}
        </div>

      </div>
      )}
       <Hero />
    {/*Scroller for Catrgories*/}
      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
        <h1 className='text-gray-800 font-bold text-2xl sm:text-3xl'>Order our best food options</h1>
        <div className='w-full relative'>
          {showLeftCateButton &&
            <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10" onClick={() => scrollHandler(cateScrollRef, "left")}>
              <FaCircleChevronLeft />
            </button>
          }

          <div
            ref={cateScrollRef}
            className="w-full flex overflow-x-auto gap-4 pb-2">
            {categories.map((cate, index) => (
              <CategoryCard data={cate.category} image={cate.image} key={index} onClick={() =>handleFilterByCategory(cate.category)}/>
            ))}
          </div>
          {showRightCateButton &&
            <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10" onClick={() => scrollHandler(cateScrollRef, "right")}>
              <FaCircleChevronRight />
            </button>
          }
        </div>


      </div>

          {/*Best Shops in your area */}
      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
        <h1 className='text-gray-800 font-bold text-2xl sm:text-3xl'>Discover best restaurants in {currentCity}</h1>
        <div className='w-full relative'>
          {showLeftShopButton &&
            <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10" onClick={() => scrollHandler(shopScrollRef, "left")}>
              <FaCircleChevronLeft />
            </button>
          }

          <div
            ref={shopScrollRef}
            className="w-full flex overflow-x-auto gap-4 pb-2">
            {shopsInMyCity?.map((shop, index) => (
              <CategoryCard data={shop.name} image={shop.image} key={index}  type="shop" onClick={()=>navigate(`/shop/${shop._id}`)}/>
            ))}
          </div>
          {showRightShopButton &&
            <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10" onClick={() => scrollHandler(shopScrollRef, "right")}>
              <FaCircleChevronRight />
            </button>
          }
        </div>

      </div>
            {/* Suggested food items */}
      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
        <h1 className='text-gray-800 font-bold text-2xl sm:text-3xl'>Suggested food items</h1>
        <div className='w-full h-auto flex flex-wrap gap-[20px] justify-center'>
          {updatedItemsList?.map((item,index)=>{
            return <FoodCard key={index} data={item}/>;
})}

        </div>
        </div>

    </div>


  )
}

export default UserDashboard