import React from "react";

import burger from "../assets/burg.png";
import pizza from "../assets/pizza.png";
import momos from "../assets/momos.png";

function HeroDesktop() {
  return (
    <div className="w-full h-[calc(100vh-80px)] bg-[#fff8f6] relative overflow-hidden flex items-center justify-center px-20">

  {/* Left Blob */}
<div className="absolute -left-52 top-10 w-[600px] h-[600px] rounded-full bg-orange-200 opacity-40 blur-2xl"></div>

{/* Right Blob */}
<div className="absolute -right-52 bottom-0 w-[600px] h-[600px] rounded-full bg-rose-200 opacity-40 blur-2xl"></div>

      {/* Left */}
      <div className="w-1/3 flex justify-center">
        <img
          src={pizza}
          alt="Pizza"
          className="w-64 animate-pizza"
        />
      </div>

      {/* Center */}
      <div className="w-1/3 flex flex-col items-center text-center px-6">

        <img
          src={momos}
          alt="Momos"
          className="w-40 mb-6 animate-momos"
        />

        <h1 className="text-6xl font-extrabold text-[#ff4d2d] leading-tight">
          Feast with Feasto
        </h1>

        <h2 className="mt-4 text-4xl font-bold  text-gray-800">
          Your Cravings, Our Priority
        </h2>

        <p className="mt-5 text-lg text-gray-600">
          Fresh meals from your favourite restaurants
          delivered to your doorstep.
        </p>

      

      </div>

      {/* Right */}
      <div className="w-1/3 flex justify-center">
        <img
          src={burger}
          alt="Burger"
          className="w-64 animate-burger"
        />
      </div>

    </div>
  );
}

export default HeroDesktop;