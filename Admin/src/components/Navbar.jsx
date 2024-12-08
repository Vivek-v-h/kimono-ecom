import React from 'react';
import { assets } from '../assets/Assets.js'; // Ensure correct named import for assets

const Navbar = ({setToken}) => {
  return (
    <div className=' flex items-center py-2 px-[4%] justify-between'>
      {/* Added descriptive alt text */}
      <img className='w-[max(60px)]' src={assets.logo} alt='Kimono brand logo' />
      
      {/* Added text inside the button */}
      <button onClick={()=>setToken('')} className='bg-[#6B4C3B] text-white px-5 py-2 sm:px-7 sm:py-2 rounded text-xs sm:text-sm'>Logout</button>
    </div>
  );
}

export default Navbar;
