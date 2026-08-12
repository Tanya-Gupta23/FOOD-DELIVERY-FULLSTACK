import React from 'react';

function CategoryCard({ data, image, type = "category", onClick }) {
  return (
    <div
      className={`${
        type === "shop"
          ? "w-[280px] h-[220px] md:w-[320px] md:h-[240px]"
          : "w-[120px] h-[120px] md:w-[180px] md:h-[180px]"
      } rounded-2xl border-2 border-[#ff4d2d] shrink-0 overflow-hidden bg-white shadow-xl shadow-gray-200 hover:shadow-lg transition-shadow relative cursor-pointer`}
      onClick={onClick}
    >
      <img
        src={image}
        alt=""
        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
      />

      <div className="absolute bottom-0 left-0 w-full bg-[#ffffff96] px-3 py-1 rounded-t-xl text-center shadow text-sm font-medium text-gray-800 backdrop-blur">
        {data}
      </div>
    </div>
  );
}

export default CategoryCard;