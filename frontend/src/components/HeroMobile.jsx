import burger from "../assets/burg.png";
import pizza from "../assets/pizza.png";
import momos from "../assets/momos.png";

function HeroMobile() {
  return (
    <div className="relative h-[75vh] bg-[#fff8f6] overflow-hidden flex flex-col items-center justify-center px-6">
{/* Mobile Left */}
<div className="absolute -left-20 top-8 w-56 h-56 bg-orange-200 rounded-full blur-2xl opacity-40"></div>

{/* Mobile Right */}
<div className="absolute -right-20 bottom-8 w-56 h-56 bg-rose-200 rounded-full blur-2xl opacity-40"></div>
      {/* Top Images */}
      <img
        src={pizza}
        alt=""
        className="absolute top-6 left-5 w-16 animate-pizza"
      />

      <img
        src={momos}
        alt=""
        className="absolute top-4 right-5 w-16 animate-momos"
      />

      {/* Text */}
      <div className="text-center z-10">
        <h1 className="text-4xl font-bold text-[#ff4d2d]">
          Feast with Feasto
        </h1>

        <h2 className="text-3xl font-bold text-gray-800">
          Your Cravings, Our Priority
        </h2>

        <p className="mt-4 text-gray-500 text-sm leading-6">
          Fresh meals from your favourite restaurants
          delivered to your doorstep.
        </p>

       
      </div>

      {/* Bottom Images */}
      <img
        src={burger}
        alt=""
        className="absolute bottom-8 left-6 w-20 animate-burger"
      />

      <img
        src={pizza}
        alt=""
        className="absolute bottom-8 right-6 w-20 animate-pizza"
      />
    </div>
  );
}

export default HeroMobile;