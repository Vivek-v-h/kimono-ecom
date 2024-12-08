import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <div className="my-10 mt-40 text-sm">
      <div className="flex flex-col sm:grid sm:grid-cols-[3fr_1fr_1fr] gap-14">
        {/* Left Section */}
        <div>
          <img src={assets.kimono} className="mb-5 w-[64px] h-[64px]" alt="" />
          <p className="w-full md:w-2/3 text-custom-text">
            Fashion is what you buy, but style is what you do with it. It’s how you take pieces and make them your own, creating a look that’s uniquely you.
          </p>
        </div>

        {/* Company Section */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-custom-text">
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Get In Touch Section */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-custom-text">
            <li>+1-234-567-8900</li>
            <li>contact@kimono.com</li>
          </ul>
        </div>

      </div>

        <div>
        
        <hr className='mt-6 border-t-1 border-custom-bg1' />
        <p className='py-5 text-sm text-center ' >Copyright 2024@ kimono.com - All Right Reserved.</p>

        </div>

    </div>
  );
};

export default Footer;
