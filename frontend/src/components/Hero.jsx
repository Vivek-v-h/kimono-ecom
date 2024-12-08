import React from 'react';
import { assets } from '../assets/assets';

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-black">
      {/* Hero left */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-custom-text">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#6B4C3B]"></p>
            <p className="font-medium text-sm md:text-base">OUR BESTSELLER</p>
          </div>
          <h1 className="text-3xl sm:py-3 lg:text-5xl leading-relaxed">Latest Arrivals</h1>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">SHOP NOW</p>
            <p className="w-8 md:w-11 h-[2px] bg-[#6B4C3B]"></p>
          </div>
        </div>
      </div>

      {/* Hero right */}
      <div className="w-full sm:w-1/2 h-80 sm:h-auto flex items-center justify-center">
        <img
          className="w-full h-full object-cover sm:max-h-[500px] lg:max-h-[600px]"
          src={assets.hero_img}
          alt="Hero"
        />
      </div>
    </div>
  );
};

export default Hero;
