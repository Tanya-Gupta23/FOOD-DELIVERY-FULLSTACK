import HeroDesktop from "./HeroDesktop";
import HeroMobile from "./HeroMobile";

function Hero() {
  return (
    <>
      <div className="hidden md:block">
        <HeroDesktop />
      </div>

      <div className="block md:hidden">
        <HeroMobile />
      </div>
    </>
  );
}

export default Hero;